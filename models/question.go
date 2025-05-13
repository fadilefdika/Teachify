package models

import (
	"time"

	"gorm.io/gorm"
)

// Question represents a single question in a quiz
type Question struct {
	ID         uint           `json:"id" gorm:"primaryKey"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"deleted_at" gorm:"index" swaggerignore:"true"`

	Text       string         `json:"text" binding:"required"` // Pertanyaan
	Options    []Option       `json:"options" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"` // Opsi jawaban
	QuizID     uint           `json:"quiz_id"`                 // Relasi ke quiz
}
