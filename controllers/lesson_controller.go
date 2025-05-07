package controllers

import (
	"lms-go/database"
	"lms-go/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CreateLessonForModule godoc
// @Summary Create a lesson for a module
// @Description Create a new lesson and associate it with a specific module by ID
// @Tags lessons
// @Accept json
// @Produce json
// @Param id path int true "Module ID"
// @Param lesson body models.Lesson true "Lesson to create"
// @Success 201 {object} models.Lesson
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /api/modules/{id}/lessons [post]
// @Security BearerAuth
func CreateLessonForModule(c *gin.Context) {
	moduleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid module ID"})
		return
	}

	var lesson models.Lesson
	if err := c.ShouldBindJSON(&lesson); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	lesson.ModuleID = uint(moduleID)

	if err := database.DB.Create(&lesson).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create lesson"})
		return
	}

	c.JSON(http.StatusCreated, lesson)
}

// GetLessonsByModule godoc
// @Summary      Get lessons by module
// @Description  Retrieve all lessons associated with a specific module by module ID
// @Tags         lessons
// @Produce      json
// @Param        id     path      int           true  "Module ID"
// @Success      200    {array}   models.Lesson
// @Failure      400    {object}  map[string]string
// @Failure      500    {object}  map[string]string
// @Router       /api/modules/{id}/lessons [get]
// @Security     BearerAuth
func GetLessonsByModule(c *gin.Context) {
	moduleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid module ID"})
		return
	}

	var lessons []models.Lesson
	if err := database.DB.Where("module_id = ?", moduleID).Find(&lessons).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch lessons"})
		return
	}

	c.JSON(http.StatusOK, lessons)
}

// GetLessonByID godoc
// @Summary      Get lesson by ID
// @Description  Retrieve a lesson by its ID
// @Tags         lessons
// @Produce      json
// @Param        id     path      int           true  "Lesson ID"
// @Success      200    {object}  models.Lesson
// @Failure      400    {object}  map[string]string
// @Failure      404    {object}  map[string]string
// @Failure      500    {object}  map[string]string
// @Router       /api/lessons/{id} [get]
// @Security     BearerAuth

func GetLessonByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid lesson ID"})
		return
	}

	var lesson models.Lesson
	if err := database.DB.First(&lesson, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}

	c.JSON(http.StatusOK, lesson)
}

// UpdateLesson godoc
// @Summary      Update lesson by ID
// @Description  Update the details of an existing lesson by its ID
// @Tags         lessons
// @Produce      json
// @Param        id     path      int           true  "Lesson ID"
// @Param        body   body      models.Lesson true  "Lesson Data"
// @Success      200    {object}  models.Lesson
// @Failure      400    {object}  map[string]string
// @Failure      404    {object}  map[string]string
// @Failure      500    {object}  map[string]string
// @Router       /api/lessons/{id} [put]
// @Security     BearerAuth
func UpdateLesson(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid lesson ID"})
		return
	}

	var lesson models.Lesson
	if err := database.DB.First(&lesson, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}

	if err := c.ShouldBindJSON(&lesson); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&lesson).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update lesson"})
		return
	}

	c.JSON(http.StatusOK, lesson)
}

// DeleteLesson godoc
// @Summary      Delete lesson by ID
// @Description  Delete a lesson from the database by its ID
// @Tags         lessons
// @Produce      json
// @Param        id     path      int      true  "Lesson ID"
// @Success      200    {object}  map[string]string
// @Failure      400    {object}  map[string]string
// @Failure      404    {object}  map[string]string
// @Failure      500    {object}  map[string]string
// @Router       /api/lessons/{id} [delete]
// @Security     BearerAuth
func DeleteLesson(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid lesson ID"})
		return
	}

	var lesson models.Lesson
	if err := database.DB.First(&lesson, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}

	if err := database.DB.Delete(&lesson).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete lesson"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Lesson deleted successfully"})
}