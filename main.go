package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Shruti/url-shortner/api/routes"
	"github.com/gin-gonic/gin"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("in url shortner")
	router := gin.Default()

	setupRouter(router)

	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}

	log.Fatal(router.Run(":" + port))

}

func setupRouter(router *gin.Engine) {
	router.POST("/api/v1", routes.ShortenULR)
	router.GET("/api/v1/:shortID", routes.GetByShortID)
	router.PUT("/api/v1/:shortID", routes.EditURL)
	router.DELETE("/api/v1/:shortID", routes.DeleteURL)
	router.POST("api/v1/addTag", routes.AddTag)
}
