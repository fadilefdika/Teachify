package models

import (
	"time"

	"gorm.io/gorm"
)

type Lesson struct {
	ID        uint      `json:"id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    DeletedAt gorm.DeletedAt `json:"deleted_at" swaggerignore:"true"` 
	Title    string `json:"title"`
	Content  string `json:"content"`
	ModuleID uint   `json:"module_id"`
}
