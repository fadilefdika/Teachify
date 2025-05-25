package main

import (
	"backend/database"
	"backend/routes"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger" // gin-swagger middleware

	_ "backend/docs"
)

//	@title			Swagger Example API
//	@version		1.0
//	@description	This is a sample server celler server.
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	API Support
//	@contact.url	http://www.swagger.io/support
//	@contact.email	support@swagger.io

func init() {
	// Memuat .env file
	err := godotenv.Load(".env")
	if err != nil{
	log.Fatalf("Error loading .env file: %s", err)
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

	gin.SetMode(gin.DebugMode)
	// Berikan log jika koneksi berhasil
	fmt.Println("Successfully connected to the database")

	// Mulai server Gin
	fmt.Println("Server dimulai di http://localhost:3000")
	r := gin.Default()
	
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3001"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	
	
	// Setup routes
	routes.SetupRoutes(r)

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	// Route default
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello, World!"})
	})
	
	jwtSecret := os.Getenv("JWT_SECRET_KEY")
	log.Println("JWT Secret Key loaded: ", jwtSecret)

	// Jalankan server
	r.Run(":3000")
}
