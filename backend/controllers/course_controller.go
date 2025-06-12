// @title LMS API
// @version 1.0
// @description This is a sample server for LMS.
// @host localhost:3000
// @BasePath /
// @schemes http

package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
	if err := database.DB.Preload("Lessons").Offset((pageNum - 1) * limitNum).Limit(limitNum).Find(&courses).Error; err != nil {
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
func GetCourseBySlug(c *gin.Context) {
	slug := c.Param("slug")

	var course models.Course

	// Preload jika kamu butuh module & creator, bisa disesuaikan
	if err := database.DB.
		Preload("Lessons").
		Where("slug = ?", slug).
		First(&course).Error; err != nil {
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
	var input struct {
		Title       string  `json:"title" binding:"required"`
		Description string  `json:"description"`
		Thumbnail   string  `json:"thumbnail"`
		Level       string  `json:"level"`
		Price       float64 `json:"price"`
		Status      string  `json:"status"`
		Category    string  `json:"category"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

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

	if currentUser.Role != "creator" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only creators can create courses"})
		return
	}

	allowedLevels := map[string]bool{"Beginner": true, "Intermediate": true, "Advanced": true}
	if input.Level != "" && !allowedLevels[input.Level] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid level value"})
		return
	}

	allowedStatus := map[string]bool{"draft": true, "published": true}
	if input.Status != "" && !allowedStatus[input.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
		return
	}

	// ✅ Generate UUID dan Slug
	courseUUID := uuid.New()
	slug := utils.GenerateSlug(input.Title, courseUUID.String())

	course := models.Course{
		ID:          courseUUID,
		Title:       input.Title,
		Description: input.Description,
		Thumbnail:   input.Thumbnail,
		Level:       input.Level,
		Price:       input.Price,
		Status:      input.Status,
		Category:    input.Category,
		CreatorId:   currentUser.ID,
		Slug:        slug,
		LastUpdated: time.Now(),
	}

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
    // Parse UUID dari param
    idParam := c.Param("id")
    courseID, err := uuid.Parse(idParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
        return
    }

    // Ambil user dari context (middleware auth)
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

    if currentUser.Role != "creator" {
        c.JSON(http.StatusForbidden, gin.H{"error": "Only creators can update courses"})
        return
    }

    // Ambil course dari DB
    var course models.Course
    if err := database.DB.First(&course, "id = ?", courseID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
        return
    }

    // Validasi kepemilikan course
    if course.CreatorId != currentUser.ID {
        c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to update this course"})
        return
    }

    // Struct input dengan pointer supaya bisa partial update
    type UpdateCourseInput struct {
        Title       *string  `json:"title"`
        Description *string  `json:"description"`
        ImageURL    *string  `json:"image_url"`
        Level       *string  `json:"level"`
        Duration    *string  `json:"duration"`
        Price       *string  `json:"price"`
        Status      *string  `json:"status"`
        Category    *string  `json:"category"`
        Lessons     *int     `json:"lessons"`
        Progress    *int     `json:"progress"`
        Rating      *float64 `json:"rating"`
        Students    *int     `json:"students"`
        // LastUpdated tidak perlu input, akan set otomatis
    }

    var input UpdateCourseInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Map input ke map[string]interface{} untuk update partial
    updates := make(map[string]interface{})
    if input.Title != nil {
        updates["title"] = *input.Title
    }
    if input.Description != nil {
        updates["description"] = *input.Description
    }
    if input.ImageURL != nil {
        updates["image_url"] = *input.ImageURL
    }
    if input.Level != nil {
        updates["level"] = *input.Level
    }
    if input.Duration != nil {
        updates["duration"] = *input.Duration
    }
    if input.Price != nil {
        updates["price"] = *input.Price
    }
    if input.Status != nil {
        updates["status"] = *input.Status
    }
    if input.Category != nil {
        updates["category"] = *input.Category
    }
    if input.Lessons != nil {
        updates["lessons"] = *input.Lessons
    }
    if input.Progress != nil {
        updates["progress"] = *input.Progress
    }
    if input.Rating != nil {
        updates["rating"] = *input.Rating
    }
    if input.Students != nil {
        updates["students"] = *input.Students
    }

    updates["last_updated"] = time.Now() // otomatis update timestamp

    if err := database.DB.Model(&course).Updates(updates).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Ambil ulang course beserta relasi creator
    if err := database.DB.Preload("Creator").First(&course, "id = ?", courseID).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated course"})
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