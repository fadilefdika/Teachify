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

	Title        string         `json:"title" binding:"required"`
	Description  string         `json:"description"`
	ImageURL     string         `json:"image_url"` // thumbnail
	Level        string         `json:"level"`     // Beginner, Intermediate, etc.
	Duration     string         `json:"duration"`  // "8 weeks"
	Price        string         `json:"price"`     // "$99"
	Status       string         `json:"status"`    // "Active", "Draft", etc.
	Category     string         `json:"category"`  // Frontend, Backend, etc.
	Lessons      int            `json:"lessons"`   // total lessons
	Progress     int            `json:"progress"`  // progress percentage (0-100)
	Rating       float64        `json:"rating"`    // e.g., 4.8
	Students     int            `json:"students"`  // enrolled students
	LastUpdated  string         `json:"last_updated"` // optional: bisa jadi time.Time

	InstructorID uint           `json:"instructor_id"`
	Instructor   User           `json:"instructor" gorm:"foreignKey:InstructorID"`

	Modules      []Module       `json:"modules" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
