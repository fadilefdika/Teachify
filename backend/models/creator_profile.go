package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CreatorProfile struct {
	ID            uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID        uuid.UUID `gorm:"type:uuid;not null"` // pastikan ini bertipe uuid.UUID
	
	PhoneNumber   string         `gorm:"type:varchar(20);not null"`
	Address       string         `gorm:"type:text;not null"`
	KTPUrl        string         `gorm:"type:text;not null"`
	CVUrl         string         `gorm:"type:text;not null"`
	PortfolioUrl  string         `gorm:"type:text"`
	BankAccount   string         `gorm:"type:varchar(50)"`
	Status        string         `gorm:"type:varchar(20);default:'pending'"` // pending, approved, rejected
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     gorm.DeletedAt `gorm:"index"`

	User *User `gorm:"foreignKey:UserID"`
}
