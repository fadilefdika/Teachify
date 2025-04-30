package routes

import (
	"lms-go/controllers"

	"lms-go/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
    r.POST("/register", controllers.Register)
    r.POST("/login", controllers.Login)
    r.GET("/admin", middlewares.JWTAuthMiddleware(), middlewares.RequireRole("admin"), controllers.AdminOnlyHandler)

    auth := r.Group("/api")
    auth.Use(middlewares.JWTAuthMiddleware())
    {
        auth.GET("/profile", controllers.Profile) // contoh route terproteksi
    }
}
