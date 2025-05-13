package models

import (
	"time"

	"gorm.io/gorm"
)

// Option represents an answer option for a question
type Option struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index" swaggerignore:"true"`

	Text        string         `json:"text" binding:"required"`  // Isi jawaban
	IsCorrect   bool           `json:"is_correct"`               // Menandai apakah ini jawaban benar
	QuestionID  uint           `json:"question_id"`              // Relasi ke question
}
