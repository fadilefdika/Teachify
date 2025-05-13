package models

import (
	"time"

	"gorm.io/gorm"
)

// Module represents a course module that contains multiple lessons
type Module struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index" swaggerignore:"true"`

	Title       string         `json:"title" binding:"required"`           // Module title
	Description string         `json:"description"`                        // Description of the module
	CourseID    uint           `json:"course_id"`                          // Foreign key to Course
	Order       uint           `json:"order"`                              // Order within the course

	Lessons     []Lesson       `json:"lessons" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` // One-to-many relationship
}
