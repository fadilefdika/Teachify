package utils

import (
	"fmt"
	"time"

	"os"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)


func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    if err != nil {
        return false // password tidak cocok
    }
    return true // password cocok
}



func GetJWTKey() []byte {
    return []byte(os.Getenv("JWT_SECRET_KEY"))
}

func GenerateJWT(userID uint) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "id": userID,
        "exp": time.Now().Add(time.Hour * 24).Unix(),
    })

    tokenString, err := token.SignedString(GetJWTKey())
    fmt.Println("Token:", tokenString)

    return tokenString, err
}


