package controllers

import (
	"lms-go/database"
	"lms-go/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CreateModuleForCourse godoc
// @Summary      Create module for a specific course
// @Description  Create a new module for a specific course by course ID
// @Tags         modules
// @Produce      json
// @Param        id     path      int      true  "Course ID"
// @Param        module body      models.Module true "Module data"
// @Success      201    {object}  models.Module
// @Failure      400    {object}  map[string]string
// @Failure      500    {object}  map[string]string
// @Router       /api/courses/{id}/modules [post]
// @Security     BearerAuth
func CreateModuleForCourse(c *gin.Context) {
	var input models.Module
	courseIDStr  := c.Param("id")

	// Convert courseID to uint
	courseIDUint, err := strconv.ParseUint(courseIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
		return
	}

	// Bind JSON input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	module := models.Module{
		Title:    input.Title,
		Content:  input.Content,
		CourseID: uint(courseIDUint),
	}

	// Create the module
	if err := database.DB.Create(&module).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, module)
}


// GetModulesByCourse godoc
// @Summary      Get modules for a specific course
// @Description  Retrieve all modules for a specific course by course ID
// @Tags         modules
// @Produce      json
// @Param        id   path      int    true  "Course ID"
// @Success      200  {array}   models.Module
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/courses/{id}/modules [get]
// @Security     BearerAuth
func GetModulesByCourse(c *gin.Context) {
	var modules []models.Module
	courseID := c.Param("id")

	// Find modules by course ID
	if err := database.DB.Where("course_id = ?", courseID).Find(&modules).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Modules not found"})
		return
	}

	c.JSON(http.StatusOK, modules)
}

// GetModuleByID godoc
// @Summary      Get a specific module by ID
// @Description  Retrieve a module by its ID
// @Tags         modules
// @Produce      json
// @Param        id   path      int    true  "Module ID"
// @Success      200  {object}  models.Module
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/modules/{id} [get]
// @Security     BearerAuth
func GetModuleByID(c *gin.Context) {
	var module models.Module
	id := c.Param("id")

	// Find module by ID
	if err := database.DB.First(&module, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Module not found"})
		return
	}

	c.JSON(http.StatusOK, module)
}

// UpdateModule godoc
// @Summary      Update an existing module by ID
// @Description  Update the details of a module, including title and content
// @Tags         modules
// @Produce      json
// @Param        id   path      int     true  "Module ID"
// @Param        body body      models.Module true "Module data"
// @Success      200  {object}  models.Module
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/modules/{id} [put]
// @Security     BearerAuth
func UpdateModule(c *gin.Context) {
	var input models.Module
	id := c.Param("id")

	// Bind JSON input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var module models.Module
	// Find module by ID
	if err := database.DB.First(&module, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Module not found"})
		return
	}

	// Update module
	module.Title = input.Title
	module.Content = input.Content

	if err := database.DB.Save(&module).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, module)
}

// DeleteModule godoc
// @Summary      Delete a module by ID
// @Description  Delete a specific module by its ID
// @Tags         modules
// @Produce      json
// @Param        id   path      int     true  "Module ID"
// @Success      200  {object}  map[string]string
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/modules/{id} [delete]
// @Security     BearerAuth
func DeleteModule(c *gin.Context) {
	id := c.Param("id")

	// Find and delete module
	if err := database.DB.Delete(&models.Module{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Module deleted successfully"})
}
