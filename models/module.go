package models

import (
	"time"

	"gorm.io/gorm"
)

type Module struct {
    ID        uint      `json:"id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    DeletedAt gorm.DeletedAt `json:"deleted_at" swaggerignore:"true"`           // Ini sudah menyertakan ID, CreatedAt, UpdatedAt, DeletedAt (soft delete)
    Title     string       `json:"title" binding:"required"`       // Judul modul, wajib diisi
    Content   string       `json:"content"`                        // Penjelasan isi modul, bisa teks, HTML, dll.
    CourseID  uint         `json:"course_id"`                      // Foreign key untuk relasi ke Course
    Lessons   []Lesson     `json:"lessons" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` // Relasi one-to-many ke Lesson
}
