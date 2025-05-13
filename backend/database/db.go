package database

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"reflect"

	"backend/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// Ambil direktori kerja saat ini
	cwd, err := os.Getwd()
	if err != nil {
		log.Fatal("Failed to get current working directory:", err)
	}
	fmt.Println("Current working directory:", cwd)

	// Path ke file .env
	envPath := filepath.Join(cwd, ".env")

	// Load environment variables
	err = godotenv.Load(envPath)
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	// Debug: cek apakah DB_HOST terbaca
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		log.Fatal("DB_HOST not found in environment variables")
	}
	fmt.Println("DB_HOST:", dbHost)

	// Bangun DSN string
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost,
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	// Koneksi ke database
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	fmt.Println("Successfully connected to the database.")
}

func AutoMigrateAll() {
	modelsToMigrate := []interface{}{
		&models.User{},
		&models.Course{},
		&models.Lesson{},
		&models.Module{},
		&models.Option{},
		&models.Question{},
		&models.Quiz{},
		&models.Attachment{},
	}

	for _, model := range modelsToMigrate {
		if err := DB.AutoMigrate(model); err != nil {
			fmt.Println("Failed to migrate:", reflect.TypeOf(model).Elem().Name())
		} else {
			fmt.Println("Migrated:", reflect.TypeOf(model).Elem().Name())
		}
	}
}
