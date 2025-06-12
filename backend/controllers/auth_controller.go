package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

var validate *validator.Validate

func init() {
	// Initialize validator
	validate = validator.New()
}

func Register(c *gin.Context) {
	type RegisterInput struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
		Role     string `json:"role" binding:"required,oneof=user creator"`
	}

	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cek apakah email sudah terdaftar
	var existing models.User
	if err := database.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email sudah terdaftar"})
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal hash password"})
		return
	}

	// Atur isApproved sesuai role (creator harus menunggu approval)
	isApproved := true
	if input.Role == "creator" {
		isApproved = false
	}

	user := models.User{
		ID:         uuid.New(),
		Username:   input.Username,
		Email:      input.Email,
		Password:   hashedPassword,
		Role:       models.Role(input.Role),
		IsApproved: isApproved,
		Status:     "active",
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat user"})
		return
	}

	token, err := utils.GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal generate token"})
		return
	}

	c.SetCookie("token", token, 3600, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Register berhasil",
		"userId":  user.ID,
		"role":    user.Role,
	})
}


func Login(c *gin.Context) {
	type LoginInput struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if !utils.CheckPasswordHash(input.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Generate JWT
	tokenString, err := utils.GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Set cookie
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   3600,
	})

	// Tentukan apakah creator harus melengkapi profil
	needsCompleteProfile := false
	if user.Role == models.RoleCreator && !user.IsApproved {
		needsCompleteProfile = true
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user": gin.H{
			"id":             user.ID,
			"username":       user.Username,
			"email":          user.Email,
			"role":           user.Role,
			"isApproved":     user.IsApproved,
			"needsCompletion": needsCompleteProfile,
			"token":          tokenString,
		},
	})
}


func Logout(c *gin.Context) {
    c.SetCookie("token", "", -1, "/", "localhost", false, true)
    c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// Profile - Handler for fetching user profile
func Profile(c *gin.Context) {
    // Misal userID diambil dari context yang sudah di-set di middleware
    userIDInterface, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
        return
    }
    userID, ok := userIDInterface.(uuid.UUID)
    if !ok {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID in context"})
        return
    }

    var user models.User
    if err := database.DB.Preload("CreatorProfile").First(&user, "id = ?", userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "user": user,
    })
}


func CompleteCreatorProfile(c *gin.Context) {
	type CreatorProfileInput struct {
		UserID      string `json:"userId" binding:"required"`
		PhoneNumber string `json:"phoneNumber" binding:"required"`
		Address     string `json:"address" binding:"required"`
		KTPUrl      string `json:"ktpUrl" binding:"required"`
		CVUrl       string `json:"cvUrl" binding:"required"`
		SelfieUrl   string `json:"selfieUrl" binding:"required"`
	}

	var input CreatorProfileInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.First(&user, "id = ? AND role = ?", input.UserID, "creator").Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User dengan role creator tidak ditemukan"})
		return
	}

	var existingProfile models.CreatorProfile
	if err := database.DB.Where("user_id = ?", input.UserID).First(&existingProfile).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Profil creator sudah pernah dibuat"})
		return
	}

	parsedUserID, err := uuid.Parse(input.UserID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "UserID tidak valid"})
		return
	}

	creatorProfile := models.CreatorProfile{
		UserID:      parsedUserID,
		PhoneNumber: input.PhoneNumber,
		Address:     input.Address,
		KTPUrl:      input.KTPUrl,
		CVUrl:       input.CVUrl,
		SelfieUrl:   input.SelfieUrl,
		Status:      "pending",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	

	if err := database.DB.Create(&creatorProfile).Error; err != nil {
		// Tampilkan error asli supaya bisa didiagnosa
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profil creator berhasil disimpan"})
}



