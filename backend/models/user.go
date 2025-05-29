package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Role string

const (
	RoleUser    Role = "user"
	RoleCreator Role = "creator"
)

type User struct {
	ID 		   uuid.UUID 	`gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Username       string         `gorm:"type:varchar(100);not null"`
	Email      string         `gorm:"uniqueIndex;type:varchar(100);not null"`
	Password   string         `gorm:"type:varchar(255);not null"`
	Role       Role           `gorm:"type:varchar(20);not null"`
	IsApproved bool           `gorm:"default:true"` // false untuk creator yang belum disetujui
	Status     string         `gorm:"type:varchar(20);default:'active'"` // active, blocked, etc.
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  gorm.DeletedAt `gorm:"index"`

	CreatorProfile *CreatorProfile `gorm:"foreignKey:UserID"`
}
