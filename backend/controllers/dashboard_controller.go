package controllers

import (
	"backend/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DashboardHandler(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		fmt.Println("DEBUG: user not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	u, ok := user.(models.User)
	if !ok {
		fmt.Println("DEBUG: failed to cast user from context")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	fmt.Printf("DEBUG: Dashboard accessed by user ID=%d, Username=%s, Email=%s, Role=%s\n", u.ID, u.Username, u.Email, u.Role)

	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome to the dashboard!",
		"user": gin.H{
			"id":    u.ID,
			"username":  u.Username,
			"email": u.Email,
			"role":  u.Role,
		},
	})
}
