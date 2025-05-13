package models

import (
	"time"

	"gorm.io/gorm"
)

// Attachment represents a file attached to a lesson
type Attachment struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index" swaggerignore:"true"`

	FilePath   string `json:"file_path" binding:"required"`  // Link to file
	FileName  string `json:"file_name"`                    // Optional readable name
	LessonID  uint   `json:"lesson_id"`                    // Foreign key to Lesson
}
