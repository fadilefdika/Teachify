package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func DashboardHandler(c *gin.Context) {
    // Assuming you're storing the user and role in the context
    user, exists := c.Get("user")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
        return
    }

    // Example response, you can customize this based on your needs
    c.JSON(http.StatusOK, gin.H{
        "message": "Welcome to the dashboard!",
        "user":    user, // Or you can extract specific fields from the user struct
    })
}
