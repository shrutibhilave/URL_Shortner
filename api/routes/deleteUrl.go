package routes

import (
	"net/http"

	"github.com/Shruti/url-shortner/api/database"
	"github.com/gin-gonic/gin"
)

func DeleteURL(c *gin.Context) {
	shortID := c.Param("shortID")

	r := database.CreateClient(0)
	defer r.Close()

	err := r.Del(database.Ctx, shortID).Err()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to delete"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Shortened URL deleted successfully"})
}
