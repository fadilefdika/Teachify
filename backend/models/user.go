package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" swaggerignore:"true"`
	Name      string         `json:"username" validate:"required"`
	Email     string         `json:"email" gorm:"unique;not null" validate:"required,email"`
	Password  string         `json:"password" gorm:"not null" validate:"required,min=8"`
	Role      string         `json:"role" gorm:"default:'student'"` // ✅ tambahkan validate
}

