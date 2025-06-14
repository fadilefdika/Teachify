package routes

import (
	"backend/controllers"
	"backend/handlers"

	"backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
    api := r.Group("/api")
    {
        // Auth routes
        api.POST("/register", controllers.Register)
        api.POST("/login", controllers.Login)
        api.POST("/logout", controllers.Logout)
        api.POST("/complete-profile",controllers.CompleteCreatorProfile)
        api.GET("/presigned-url", handlers.GeneratePresignedURL)
       

        // Protected routes
        authorized := api.Group("/")
        authorized.Use(middlewares.JWTAuthMiddleware())
        {
            authorized.GET("/dashboard", controllers.DashboardHandler)
            authorized.GET("/profile", controllers.Profile)

            // Admin-only route (tambahkan middleware role di sini)
            authorized.GET("/admin", middlewares.RequireRole("admin"), controllers.AdminOnlyHandler)

            // Courses
            authorized.POST("/courses", controllers.CreateCourse)
            authorized.GET("/courses", controllers.GetAllCourses)
            authorized.GET("/courses/:slug", controllers.GetCourseBySlug)
            authorized.PUT("/courses/:id", controllers.UpdateCourse)
            authorized.DELETE("/courses/:id", controllers.DeleteCourse)


            // Lessons
            authorized.POST("/modules/:id/lessons", controllers.CreateLessonForCourse)
            authorized.GET("/lessons/:id", controllers.GetLessonByID)
            authorized.PUT("/lessons/:id", controllers.UpdateLesson)
            authorized.DELETE("/lessons/:id", controllers.DeleteLesson)
        }
    }
}

