package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Shruti/url-shortner/backend/api/routes"
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

	// port := os.Getenv("APP_PORT")
	// if port == "" {
	// 	port = "8080"
	// }

	// log.Fatal(router.Run(":" + port))
	log.Fatal(router.Run(":8000")) // listen on port 8000 inside the container

}

func setupRouter(router *gin.Engine) {
	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent) // 204
			return
		}

		c.Next()
	})

	router.POST("/api/v1", routes.ShortenULR)
	router.GET("/api/v1/:shortID", routes.GetByShortID)
	router.PUT("/api/v1/:shortID", routes.EditURL)
	router.DELETE("/api/v1/:shortID", routes.DeleteURL)
	router.POST("/api/v1/addTag", routes.AddTag)
	router.GET("/api/v1/qrcode/:shortID", routes.GenerateQRCode)
}
