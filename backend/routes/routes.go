package routes

import (
	"backend/controllers"

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
            authorized.GET("/courses/:id", controllers.GetCourseByID)
            authorized.PUT("/courses/:id", controllers.UpdateCourse)
            authorized.DELETE("/courses/:id", controllers.DeleteCourse)

            // Modules
            authorized.GET("/courses/:id/modules", controllers.GetModulesByCourse)
            authorized.POST("/courses/:id/modules", controllers.CreateModule)
            authorized.GET("/modules/:id", controllers.GetModuleByID)
            authorized.PUT("/modules/:id", controllers.UpdateModule)
            authorized.DELETE("/modules/:id", controllers.DeleteModule)

            // Lessons
            authorized.GET("/modules/:id/lessons", controllers.GetLessonsByModule)
            authorized.POST("/modules/:id/lessons", controllers.CreateLessonForModule)
            authorized.GET("/lessons/:id", controllers.GetLessonByID)
            authorized.PUT("/lessons/:id", controllers.UpdateLesson)
            authorized.DELETE("/lessons/:id", controllers.DeleteLesson)
        }
    }
}

