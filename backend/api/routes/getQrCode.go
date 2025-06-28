package routes

import (
	"fmt"
	"net/http"

	"github.com/Shruti/url-shortner/backend/database"
	"github.com/gin-gonic/gin"
	"github.com/skip2/go-qrcode"
)

func GenerateQRCode(c *gin.Context) {
	shortID := c.Param("shortID")
	if shortID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Missing 'code' query parameter",
		})
		return
	}

	r := database.CreateClient(0)
	defer r.Close()

	// Validate if shortID exists
	val, err := r.Get(database.Ctx, shortID).Result()
	if err != nil || val == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "ShortID does not exist"})
		return
	}

	// Generate the full shortened URL
	fullURL := fmt.Sprintf("http://localhost:8000/%s", shortID)

	// Generate QR code as PNG
	png, err := qrcode.Encode(fullURL, qrcode.Medium, 256)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate QR code"})
		return
	}

	// Return image as PNG
	c.Header("Content-Type", "image/png")
	c.Writer.Write(png)
}
