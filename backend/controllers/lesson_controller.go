package controllers

import (
	"backend/database"
	"backend/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
func CreateLessonForCourse(c *gin.Context) {
    courseIDStr := c.Param("course_id")

    // Convert courseID string ke UUID
    courseID, err := uuid.Parse(courseIDStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
        return
    }

    // Cek apakah course ada
    var course models.Course
    if err := database.DB.First(&course, "id = ?", courseID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
        return
    }

    // Bind input lesson (bisa pakai struct terpisah kalau mau validasi khusus)
    var input struct {
        Title       string  `json:"title" binding:"required"`
        VideoURL    string  `json:"video_url,omitempty"`
        Duration    int     `json:"duration,omitempty"`  // durasi dalam menit/detik
        Thumbnail   string  `json:"thumbnail,omitempty"`
        Description string  `json:"description,omitempty"`
        Content     string  `json:"content,omitempty"`
        IsPreview   bool    `json:"is_preview"`
        Order       uint    `json:"order" binding:"required"`
        QuizID      *uint   `json:"quiz_id,omitempty"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    lesson := models.Lesson{
        CourseID:    courseID,
        Title:       input.Title,
        VideoURL:    input.VideoURL,
        Duration:    input.Duration,
        Thumbnail:   input.Thumbnail,
        Description: input.Description,
        Content:     input.Content,
        IsPreview:   input.IsPreview,
        Order:       input.Order,
        QuizID:      input.QuizID,
    }

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
// func GetLessonsByModule(c *gin.Context) {
// 	moduleIDStr := c.Param("id")

// 	// Convert moduleID to uint
// 	moduleID, err := strconv.ParseUint(moduleIDStr, 10, 64)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid module ID"})
// 		return
// 	}

// 	// Check if module exists
// 	var module models.Module
// 	if err := database.DB.First(&module, moduleID).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Module not found"})
// 		return
// 	}

// 	// Find lessons by module ID
// 	var lessons []models.Lesson
// 	if err := database.DB.Where("module_id = ?", moduleID).Find(&lessons).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch lessons"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, lessons)
// }


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
	// Ambil ID dari URL parameter dan konversi ke uint
	lessonIDStr := c.Param("id")
	lessonID, err := strconv.ParseUint(lessonIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid lesson ID"})
		return
	}

	// Cari lesson berdasarkan ID
	var lesson models.Lesson
	if err := database.DB.First(&lesson, lessonID).Error; err != nil {
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
	// Ambil ID dari URL parameter dan konversi ke uint
	lessonIDStr := c.Param("id")
	lessonID, err := strconv.ParseUint(lessonIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid lesson ID"})
		return
	}

	// Cari lesson berdasarkan ID
	var lesson models.Lesson
	if err := database.DB.First(&lesson, lessonID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}

	// Bind JSON input dan update hanya yang diperlukan
	if err := c.ShouldBindJSON(&lesson); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Simpan perubahan ke database
	if err := database.DB.Save(&lesson).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update lesson"})
		return
	}

	// Kembalikan lesson yang sudah diperbarui
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
	// Ambil ID dari URL parameter dan konversi ke uint
	lessonIDStr := c.Param("id")
	lessonID, err := strconv.ParseUint(lessonIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid lesson ID"})
		return
	}

	// Cari lesson berdasarkan ID
	var lesson models.Lesson
	if err := database.DB.First(&lesson, lessonID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}

	// Hapus lesson
	if err := database.DB.Delete(&lesson).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete lesson"})
		return
	}

	// Kembalikan pesan sukses
	c.JSON(http.StatusOK, gin.H{"message": "Lesson deleted successfully"})
}
