package models

import (
	"time"

	"gorm.io/gorm"
)

// Quiz represents a quiz related to a lesson
type Quiz struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index" swaggerignore:"true"`

	Title     string         `json:"title"`                  // Quiz title
	LessonID  uint           `json:"lesson_id"`              // Foreign key to Lesson
	Questions []Question     `json:"questions" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` // One-to-many relation to questions
}
