package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Lesson represents a lesson inside a module
type Lesson struct {
    ID          uint           `json:"id" gorm:"primaryKey"`
    CreatedAt   time.Time      `json:"created_at"`
    UpdatedAt   time.Time      `json:"updated_at"`
    DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index" swaggerignore:"true"`

    CourseID    uuid.UUID      `json:"course_id"`                   // Foreign key ke Course

    Title       string         `json:"title" binding:"required"`   // Judul lesson
    VideoURL    string         `json:"video_url,omitempty"`        // Link video (bisa kosong)
    Duration    int            `json:"duration,omitempty"`         // Durasi dalam detik atau menit
    Thumbnail   string         `json:"thumbnail,omitempty"`        // Gambar preview (optional)
    Description string         `json:"description,omitempty"`      // Ringkasan materi
    Content     string         `json:"content,omitempty"`          // Isi materi (HTML / markdown)

    Attachments []Attachment   `json:"attachments" gorm:"foreignKey:LessonID"` // File attachment, kalau ada

    IsPreview   bool           `json:"is_preview"`                 // Bisa diakses tanpa daftar course

    Order       uint           `json:"order"`                      // Urutan lesson dalam course

    QuizID      *uint          `json:"quiz_id,omitempty"`          // Optional quiz ID
    Quiz        *Quiz          `json:"quiz" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

