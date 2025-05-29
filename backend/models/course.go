package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Course represents a learning course
type Course struct {
	ID           uuid.UUID      `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    gorm.DeletedAt `gorm:"index"`

	Title        string         `json:"title" binding:"required"`
	Description  string         `json:"description"`
	ImageURL     string         `json:"image_url"`
	Level        string         `json:"level"`
	Duration     string         `json:"duration"`
	Price        string         `json:"price"`
	Status       string         `json:"status"`
	Category     string         `json:"category"`
	Lessons      int            `json:"lessons"`
	Progress     int            `json:"progress"`
	Rating       float64        `json:"rating"`
	Students     int            `json:"students"`
	LastUpdated  string         `json:"last_updated"`

	CreatorId    uuid.UUID      `json:"creator_id"`
	Creator      User           `json:"creator" gorm:"foreignKey:CreatorId"`

	Modules      []Module       `json:"modules" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}