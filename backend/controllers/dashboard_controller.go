package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DashboardHandler(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	u := user.(models.User)

	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome to the dashboard!",
		"user": gin.H{
			"id": u.ID,
			"name": u.Name,
			"email": u.Email,
			"role": u.Role,
		},
	})
}
