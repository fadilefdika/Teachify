package main

import (
	"backend/database"
	"backend/routes"
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "backend/docs"
)

func init() {
	// Load environment variables from .env
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
	}
}

// Inisialisasi AWS S3 client, bisa dipanggil dari handler jika perlu
func initS3Client() (*s3.Client, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(os.Getenv("AWS_REGION")),
	)
	if err != nil {
		return nil, fmt.Errorf("unable to load AWS config: %w", err)
	}

	client := s3.NewFromConfig(cfg)
	return client, nil
}

func main() {
	// Koneksi database
	database.ConnectDB()
	database.AutoMigrateAll()

	if database.DB == nil {
		log.Fatal("Database connection failed")
		return
	}
	fmt.Println("Successfully connected to the database")

	// (Opsional) Test AWS S3 connection, hapus jika tidak perlu
	client, err := initS3Client()
	if err != nil {
		log.Fatalf("Failed to initialize S3 client: %v", err)
	}

	bucket := os.Getenv("AWS_S3_BUCKET")
	if bucket == "" {
		log.Println("Warning: AWS_S3_BUCKET environment variable not set")
	} else {
		output, err := client.ListObjectsV2(context.TODO(), &s3.ListObjectsV2Input{
			Bucket: aws.String(bucket),
		})
		if err != nil {
			log.Printf("Failed to list objects in bucket %s: %v", bucket, err)
		} else {
			log.Println("First page of S3 bucket objects:")
			for _, obj := range output.Contents {
				log.Printf("key=%s size=%d", aws.ToString(obj.Key), obj.Size)
			}
		}
	}

	// Setup Gin
	gin.SetMode(gin.DebugMode)
	r := gin.Default()

	// CORS config
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
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello, World!"})
	})

	jwtSecret := os.Getenv("JWT_SECRET_KEY")
	if(jwtSecret != " "){
		log.Println("JWT Secret Key loaded from env")
	}

	// Run server
	if err := r.Run(":3000"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
