package database

import (
	"fmt"
	"log"
	"reflect"

	"lms-go/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
    dsn := "host=localhost user=postgres password=postgres123 dbname=lms_db port=5432 sslmode=disable"
    var err error
    DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
}


func AutoMigrateAll() {
	// Daftar model yang akan dimigrasi
	modelsToMigrate := []interface{}{
		&models.User{},    // Model User
	}

	// Lakukan migrasi untuk setiap model
	for _, model := range modelsToMigrate {
		if err := DB.AutoMigrate(model); err != nil {
			fmt.Println("Failed to migrate:", reflect.TypeOf(model).Elem().Name())
		} else {
			fmt.Println("Migrated:", reflect.TypeOf(model).Elem().Name())
		}
	}
}