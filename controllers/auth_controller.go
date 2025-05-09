package controllers

import (
	"lms-go/database"
	"lms-go/models"
	"lms-go/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

var validate *validator.Validate

func init() {
	// Initialize validator
	validate = validator.New()
}

// Register - Handler for user registration
func Register(c *gin.Context) {
	var input models.User

	// Bind JSON input and validate
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	// Validate input using validator
	if err := validate.Struct(&input); err != nil {
		var errorMessages []string
		for _, err := range err.(validator.ValidationErrors) {
			errorMessages = append(errorMessages, err.Field()+" failed validation: "+err.Tag())
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": errorMessages})
		return
	}

	// Check if email already exists
	var existingUser models.User
	if err := database.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email is already registered"})
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Create new user
	user := models.User{Name: input.Name, Email: input.Email, Password: hashedPassword}

	// Start transaction to ensure atomicity
	tx := database.DB.Begin()

	// Check if transaction starts successfully
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// Attempt to insert user into database
	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback() // rollback transaction if error occurs
		// Handle error during database insert
		if err == gorm.ErrDuplicatedKey {
			c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists"})
		} else {
			// Log the error for debugging purposes
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		}
		return
	}

	tx.Commit() // commit transaction

	// Respond with success
	c.JSON(http.StatusOK, gin.H{"message": "Registration successful"})
}


// Login - Handler for user login
func Login(c *gin.Context) {
    var input models.User
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user models.User
    if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    // Check password hash
    if !utils.CheckPasswordHash(input.Password, user.Password) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    // Generate JWT token
    token, err := utils.GenerateJWT(user.ID,user.Role)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"token": token})
}

// Profile - Handler for fetching user profile
func Profile(c *gin.Context) {
    user := c.MustGet("user").(models.User)
    c.JSON(http.StatusOK, gin.H{"user": user})
}
