package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
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

	// Debug input dari request
	fmt.Println("DEBUG: Input from JSON =>", input)

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

	// Debug user yang akan disimpan
	fmt.Println("DEBUG: User to be saved =>", user)

	// Start transaction
	tx := database.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}
	tx.Commit()
	
	token, err := utils.GenerateJWT(user.ID,)
    if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }
	c.SetCookie("token", token, 3600, "/", "localhost", false, true)
	

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
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Email not found"})
        return
    }

    if !utils.CheckPasswordHash(input.Password, user.Password) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
        return
    }

    tokenString, err := utils.GenerateJWT(user.ID,)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    // Set cookie — _PASTIKAN SESUAI_ DENGAN DOMAIN & HTTPS
    http.SetCookie(c.Writer, &http.Cookie{
        Name:     "token",
        Value:    tokenString,
        Path:     "/",
        HttpOnly: true,
        Secure:   false, // ubah ke true kalau pakai HTTPS di prod
        SameSite: http.SameSiteLaxMode, // Bisa diubah ke None saat HTTPS
        MaxAge:   3600,
    })

    c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}





func Logout(c *gin.Context) {
    c.SetCookie("token", "", -1, "/", "localhost", false, true)
    c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// Profile - Handler for fetching user profile
func Profile(c *gin.Context) {
	// Ambil user dari context (diset di middleware)
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user.(models.User), // Pastikan type cast ke models.User
	})
}