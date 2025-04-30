package models

import (
	"gorm.io/gorm"
)

type User struct {
    gorm.Model
    Name     string `json:"name" validate:"required"`
    Email    string `json:"email" gorm:"unique;not null" validate:"required,email"`
    Password string `json:"password" gorm:"not null" validate:"required,min=8"`
    Role     string `json:"role" gorm:"default:'user'"`
}
