package main

import (
	"fmt"
	"lms-go/database"
	"lms-go/routes"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	// Memuat .env file
	if err := godotenv.Load("../.env"); err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	// Koneksi ke database
	database.ConnectDB()
	database.AutoMigrateAll()

	// Cek apakah koneksi ke database berhasil
	if database.DB == nil {
		log.Fatal("Database connection failed")
		return
	}

	// Berikan log jika koneksi berhasil
	fmt.Println("Successfully connected to the database")

	// Mulai server Gin
	fmt.Println("Server dimulai di http://localhost:8080")
	r := gin.Default()

	// Setup routes
	routes.SetupRoutes(r)

	// Route default
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello, World!"})
	})
	
	jwtSecret := os.Getenv("JWT_SECRET_KEY")
	log.Println("JWT Secret Key loaded: ", jwtSecret)

	// Jalankan server
	r.Run(":8080")
}
