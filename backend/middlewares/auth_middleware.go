package middlewares

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Ambil token dari cookie
		tokenCookie, err := c.Cookie("token")
		if err != nil {
			fmt.Println("[Middleware] Error getting token cookie:", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token cookie required"})
			c.Abort()
			return
		}

		fmt.Println("[Middleware] Received token:", tokenCookie)

		// Parse token dengan validasi signing method dan secret key
		token, err := jwt.Parse(tokenCookie, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return utils.GetJWTKey(), nil
		})

		if err != nil {
			fmt.Println("[Middleware] Error parsing token:", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		if !token.Valid {
			fmt.Println("[Middleware] Token is invalid")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Ambil claims dari token
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			fmt.Println("[Middleware] Failed to parse token claims")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		// Ambil userID dari claims sebagai string
		idStr, ok := claims["id"].(string)
		if !ok {
			fmt.Println("[Middleware] Token ID claim invalid or missing")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token ID claim"})
			c.Abort()
			return
		}
		userID := idStr

		// Ambil user dari database
		var user models.User
		if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
			fmt.Println("[Middleware] User not found with ID:", userID)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			c.Abort()
			return
		}


		// Log waktu expire dari token (kalau ada)
		if exp, ok := claims["exp"].(float64); ok {
			expTime := time.Unix(int64(exp), 0)
			fmt.Println("[Middleware] Token expires at:", expTime)
		} else {
			fmt.Println("[Middleware] Token expiration claim missing")
		}

		c.Set("userID", user.ID)
		c.Set("user", user)
		c.Next()
	}
}



