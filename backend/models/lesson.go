package models

import (
	"time"

	"gorm.io/gorm"
)

// Lesson represents a lesson inside a module
type Lesson struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index" swaggerignore:"true"`

	Title       string         `json:"title" binding:"required"`    // Lesson title
	VideoURL    string         `json:"video_url"`                   // Link to the video
	Duration    string         `json:"duration"`                    // e.g. "5m30s"
	Thumbnail   string         `json:"thumbnail"`                   // Image preview
	Description string         `json:"description"`                 // Summary or detail
	Content     string         `json:"content"`                     // Rich HTML or markdown

	Attachments []Attachment   `json:"attachments" gorm:"foreignKey:LessonID"` // File list (moved to separate table if needed)
	IsPreview   bool           `json:"is_preview"`                  // Whether it's accessible without enrolling
	Order       uint           `json:"order"`                       // Lesson order in the module

	QuizID      *uint          `json:"quiz_id"`                     // Optional quiz
	Quiz        *Quiz          `json:"quiz" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	ModuleID    uint           `json:"module_id"`                   // Foreign key to module
}
