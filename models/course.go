package models

import (
	"time"

	"gorm.io/gorm"
)

type Course struct {
    ID        uint      `json:"id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    DeletedAt gorm.DeletedAt `json:"deleted_at" swaggerignore:"true"`
    Title       string    `json:"title" binding:"required"`
    Description string    `json:"description"`
    Modules     []Module  `json:"modules" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
