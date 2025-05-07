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
	"net/http"

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

	// Find all courses
	if err := database.DB.Find(&courses).Error; err != nil {
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
	var course models.Course
	id := c.Param("id")

	// Find course by ID
	if err := database.DB.First(&course, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}
	database.DB.Preload("Modules.Lesson").First(&course, id)

	c.JSON(http.StatusOK, course)
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
	var input models.Course
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	course := models.Course{
		Title:       input.Title,
		Description: input.Description,
	}

	if err := database.DB.Create(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, course)
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
	var input models.Course
	id := c.Param("id")

	// Bind JSON input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var course models.Course
	// Find course by ID
	if err := database.DB.First(&course, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// Update course
	course.Title = input.Title
	course.Description = input.Description

	if err := database.DB.Save(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, course)
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
	id := c.Param("id")

	// Find and delete course
	if err := database.DB.Delete(&models.Course{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Course deleted successfully"})
}
