package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Course represents a learning course
type Course struct {
    ID          uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
    CreatedAt   time.Time
    UpdatedAt   time.Time
    DeletedAt   gorm.DeletedAt `gorm:"index"`
    Slug string `gorm:"uniqueIndex" json:"slug"`

    Title       string         `json:"title" binding:"required"`
    Description string         `json:"description,omitempty"`
    Thumbnail    string         `json:"thumbnail,omitempty"`
    Level       string         `json:"level,omitempty"`      // Bisa "Beginner", "Intermediate", "Advanced"
    Duration    int            `json:"duration,omitempty"`   // Total durasi dalam menit, misal 120 (integer lebih cocok daripada string)
    Price       float64        `json:"price,omitempty"`      // Harga dalam angka, misal 150000.00
    Status      string         `json:"status,omitempty"`     // misal "draft", "published"
    Category    string         `json:"category,omitempty"`

    // Statistik course (bisa dihitung realtime, jadi opsional untuk simpan)
    LessonCount int            `json:"lesson_count,omitempty"` 
    Progress    int            `json:"progress,omitempty"`   // bisa persentase 0-100 jika mau simpan progress pembelajaran
    Rating      float64        `json:"rating,omitempty"`     // misal 4.5
    StudentCount int           `json:"student_count,omitempty"`

    LastUpdated time.Time      `json:"last_updated,omitempty"`

    CreatorId   uuid.UUID      `json:"creator_id"`
    Creator     User           `json:"creator" gorm:"foreignKey:CreatorId"`

    Lessons    []Lesson        `json:"lessons" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
