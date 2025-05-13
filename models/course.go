package models

import (
	"time"

	"gorm.io/gorm"
)

// Course represents a learning course
type Course struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at" gorm:"index" swaggerignore:"true"`

	Title        string         `json:"title" binding:"required"`       // Course title
	Description  string         `json:"description"`                   // Course description
	ImageURL     string         `json:"image_url"`                     // Thumbnail or cover URL
	InstructorID uint           
	Instructor   User 			`gorm:"foreignKey:InstructorID"` // relasi ke user `json:"instructor_id"`                 // Related user ID (foreign key)
	Level        string         `json:"level"`                         // Example: beginner, intermediate, advanced
	IsPublished  bool           `json:"is_published"`                  // Publish status

	Modules      []Module       `json:"modules" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
