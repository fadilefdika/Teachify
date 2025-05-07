package routes

import (
	"lms-go/controllers"

	"lms-go/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
    api := r.Group("/api")
    {
        // Auth
        api.POST("/register", controllers.Register)
        api.POST("/login", controllers.Login)

        // Protected routes
        apiAuth := api.Group("/")
        apiAuth.Use(middlewares.JWTAuthMiddleware())
        {
            apiAuth.GET("/profile", controllers.Profile)

            // Admin-only example
            apiAuth.GET("/admin", middlewares.RequireRole("admin"), controllers.AdminOnlyHandler)

            // Courses
            apiAuth.POST("/courses", controllers.CreateCourse)
            apiAuth.GET("/courses", controllers.GetAllCourses)
            apiAuth.GET("/courses/:id", controllers.GetCourseByID)
            apiAuth.PUT("/courses/:id", controllers.UpdateCourse)
            apiAuth.DELETE("/courses/:id", controllers.DeleteCourse)

            // Modules within a course
            apiAuth.GET("/courses/:id/modules", controllers.GetModulesByCourse)
            apiAuth.POST("/courses/:id/modules", controllers.CreateModuleForCourse)

            // Individual modules
            apiAuth.GET("/modules/:id", controllers.GetModuleByID)
            apiAuth.PUT("/modules/:id", controllers.UpdateModule)
            apiAuth.DELETE("/modules/:id", controllers.DeleteModule)


            apiAuth.GET("/modules/:id/lessons", controllers.GetLessonsByModule)
            apiAuth.POST("/modules/:id/lessons", controllers.CreateLessonForModule)
            apiAuth.GET("/lessons/:id", controllers.GetLessonByID)
            apiAuth.PUT("/lessons/:id", controllers.UpdateLesson)
            apiAuth.DELETE("/lessons/:id", controllers.DeleteLesson)
        }
    }
}


