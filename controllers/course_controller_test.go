package controllers

import (
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetAllCourses(t *testing.T) {
    // Setup Gin router
	
    gin.SetMode(gin.TestMode)
    router := gin.Default()

    // Mock route untuk GetAllCourses
    router.GET("/courses", GetAllCourses)

    // Create a request with valid query parameters
    req, _ := http.NewRequest(http.MethodGet, "/courses?page=1&limit=10", nil)

    // Record the response
    resp := httptest.NewRecorder()
    router.ServeHTTP(resp, req)

    // Log response body untuk debugging
    log.Println("Response Body:", resp.Body.String())

    // Assert the response status code
    assert.Equal(t, http.StatusOK, resp.Code)

    // Optionally, assert some response body content if needed
    // assert.Contains(t, resp.Body.String(), "course_name")
}



func TestGetCourseByID(t *testing.T) {
	// Setup Gin router
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	// Mock route for GetCourseByID
	router.GET("/courses/:id", GetCourseByID)

	// Create a request to get a course by ID (assumes ID 1 exists)
	req, _ := http.NewRequest(http.MethodGet, "/courses/1", nil)

	// Record the response
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	log.Println("Response Body:", resp.Body.String())
	// Assert the response status code
	assert.Equal(t, http.StatusOK, resp.Code)

	// Optionally, assert some response body content
	// assert.Contains(t, resp.Body.String(), "course_name") // Adjust for your course structure
}

func TestCreateCourse(t *testing.T) {
	// Setup Gin router
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	// Mock route for CreateCourse
	router.POST("/courses", CreateCourse)

	// Create a request to create a new course
	// (Make sure to replace with valid course data as needed)
	courseData := `{
		"title": "New Course",
		"description": "This is a test course",
		"instructor_id": 1,
		"level": "Beginner",
		"is_published": true
	}`

	req, _ := http.NewRequest(http.MethodPost, "/courses", strings.NewReader(courseData))
	req.Header.Set("Content-Type", "application/json")

	// Record the response
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// Assert the response status code
	assert.Equal(t, http.StatusCreated, resp.Code)

	// Optionally, assert some response body content
	// assert.Contains(t, resp.Body.String(), "course_name") // Replace with actual course data to check
}

func TestUpdateCourse(t *testing.T) {
	// Setup Gin router
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	// Mock route for UpdateCourse
	router.PUT("/courses/:id", UpdateCourse)

	// Create a request to update an existing course (assumes ID 1 exists)
	// (Make sure to replace with valid course data as needed)
	updatedCourseData := `{
		"title": "Updated Course",
		"description": "This is an updated test course",
		"instructor_id": 1,
		"level": "Advanced",
		"is_published": false
	}`

	req, _ := http.NewRequest(http.MethodPut, "/courses/1", strings.NewReader(updatedCourseData))
	req.Header.Set("Content-Type", "application/json")

	// Record the response
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// Assert the response status code
	assert.Equal(t, http.StatusOK, resp.Code)

	// Optionally, assert some response body content
	// assert.Contains(t, resp.Body.String(), "Updated Course") // Replace with actual updated data to check
}

func TestDeleteCourse(t *testing.T) {
	// Setup Gin router
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	// Mock route for DeleteCourse
	router.DELETE("/courses/:id", DeleteCourse)

	// Create a request to delete a course by ID (assumes ID 1 exists)
	req, _ := http.NewRequest(http.MethodDelete, "/courses/1", nil)

	// Record the response
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// Assert the response status code
	assert.Equal(t, http.StatusOK, resp.Code)

	// Optionally, assert some response body content
	// assert.Contains(t, resp.Body.String(), "Course deleted successfully") // Replace with actual message to check
}