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
	user := models.User{Name: input.Name, Email: input.Email, Password: hashedPassword, Role: input.Role}

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

	// Debug setelah berhasil simpan
	fmt.Println("DEBUG: User created successfully with role =>", user.Role)

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

    // Check password hash
    if !utils.CheckPasswordHash(input.Password, user.Password) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
        return
    }

    // Generate JWT token
    token, err := utils.GenerateJWT(user.ID, user.Role)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    // Set HttpOnly cookie (secure: true jika HTTPS)
    c.SetCookie(
        "token", token,
        3600,       // Expires in 1 hour (3600 seconds)
        "/",        // Path
        "localhost", // Domain, sesuaikan jika di production
        false,      // Secure = false untuk dev, true jika HTTPS
        true,       // HttpOnly
    )

    // Bisa juga kirim data user jika perlu
    c.JSON(http.StatusOK, gin.H{"message": "Login successful","token" : token})
}


// Profile - Handler for fetching user profile
func Profile(c *gin.Context) {
    user := c.MustGet("user").(models.User)
    c.JSON(http.StatusOK, gin.H{"user": user})
}


func Logout(c *gin.Context) {
    c.SetCookie("token", "", -1, "/", "localhost", false, true)
    c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
