// @title LMS API
// @version 1.0
// @description This is a sample server for LMS.
// @host localhost:3000
// @BasePath /
// @schemes http

package controllers

import (
	"lms-go/database"
	"lms-go/models"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetAllCourses godoc
// @Summary      Get all courses
// @Description  Retrieve all the courses from the database
// @Tags         courses
// @Produce      json
// @Success      200  {array}  models.Course
// @Failure      500  {object}  response.ErrorResponse
// @Router       /api/courses [get]
// @Security     BearerAuth
func GetAllCourses(c *gin.Context) {
	var courses []models.Course
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "10")

	// Convert to int
	pageNum, err := strconv.Atoi(page)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}
	limitNum, err := strconv.Atoi(limit)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit number"})
		return
	}

	// Find all courses with pagination and preload r elations
	if err := database.DB.Preload("Modules.Lessons").Offset((pageNum - 1) * limitNum).Limit(limitNum).Find(&courses).Error; err != nil {
		log.Println("Database error:", err)  // Menambahkan log
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, courses)
}



// GetCourseByID godoc
// @Summary      Get course by ID
// @Description  Retrieve a single course by its ID including its modules and lessons
// @Tags         courses
// @Produce      json
// @Param        id   path      int  true  "Course ID"
// @Success      200  {object}  models.Course
// @Failure      404  {object}  response.ErrorResponse
// @Failure      500  {object}  response.ErrorResponse
// @Router       /api/courses/{id} [get]
// @Security     BearerAuth
func GetCourseByID(c *gin.Context) {
	// Ambil ID dari URL dan konversi ke uint
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
		return
	}

	var course models.Course

	// Preload Modules -> Lessons dan juga relasi User sebagai Instructor
	if err := database.DB.
		Preload("Modules.Lessons").
		Preload("Instructor").
		First(&course, uint(id)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"course": course,
	})
}


// CreateCourse godoc
// @Summary Create a new course
// @Description Add a new course to the database
// @Tags courses
// @Accept json
// @Produce json
// @Param course body models.Course true "Course data"
// @Success 201 {object} models.Course
// @Failure 400 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /api/courses [post]
// @Security BearerAuth
func CreateCourse(c *gin.Context) {
	// Ambil data user dari context (diasumsikan sudah diset oleh middleware auth)
	user, exists := c.Get("user") // user di-set sebelumnya via middleware
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Konversi ke struct User
	currentUser, ok := user.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse user"})
		return
	}

	// Cek apakah role-nya adalah instructor
	if currentUser.Role != "instructor" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only instructors can create courses"})
		return
	}

	var input models.Course

	// Bind input JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Buat course baru dengan ID instruktur dari user login
	course := models.Course{
		Title:        input.Title,
		Description:  input.Description,
		ImageURL:     input.ImageURL,
		InstructorID: currentUser.ID,
		Level:        input.Level,
		IsPublished:  input.IsPublished,
	}

	// Simpan ke DB
	if err := database.DB.Create(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Course created successfully",
		"course":  course,
	})
}


// UpdateCourse godoc
// @Summary Update a course
// @Description Update the details of a course by ID
// @Tags courses
// @Accept json
// @Produce json
// @Param id path string true "Course ID"
// @Param course body models.Course true "Updated course data"
// @Success 200 {object} models.Course
// @Failure 400 {object} response.ErrorResponse
// @Failure 404 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /api/courses/{id} [put]
// @Security BearerAuth
func UpdateCourse(c *gin.Context) {
	// Ambil ID dari parameter URL
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
		return
	}

	// Ambil data user dari context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	currentUser, ok := user.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse user"})
		return
	}

	if currentUser.Role != "instructor" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only instructors can update courses"})
		return
	}

	// Struct input terpisah agar lebih aman
	type UpdateCourseInput struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		ImageURL    string `json:"image_url"`
		Level       string `json:"level"`
		IsPublished bool   `json:"is_published"`
	}

	var input UpdateCourseInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ambil course yang akan diupdate
	var course models.Course
	if err := database.DB.First(&course, uint(id)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// Cek kepemilikan course
	if course.InstructorID != currentUser.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to update this course"})
		return
	}

	// Update field
	course.Title = input.Title
	course.Description = input.Description
	course.ImageURL = input.ImageURL
	course.Level = input.Level
	course.IsPublished = input.IsPublished

	// Simpan perubahan
	if err := database.DB.Save(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Preload relasi instructor sebelum response
	if err := database.DB.Preload("Instructor").First(&course, course.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated course with instructor"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Course updated successfully",
		"course":  course,
	})
}



// DeleteCourse godoc
// @Summary Delete a course
// @Description Delete a course by ID
// @Tags courses
// @Produce json
// @Param id path string true "Course ID"
// @Success 200 {object} map[string]string
// @Failure 500 {object} response.ErrorResponse
// @Router /api/courses/{id} [delete]
// @Security BearerAuth
func DeleteCourse(c *gin.Context) {
	// Get ID from URL parameter and convert to uint
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32) // Convert to uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
		return
	}

	// Find course by ID
	var course models.Course
	if err := database.DB.First(&course, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// Delete course (soft delete)
	if err := database.DB.Delete(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Course deleted successfully"})
}