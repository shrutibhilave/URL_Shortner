package routes

import (
	"encoding/json"
	"net/http"

	"github.com/Shruti/url-shortner/api/database"
	"github.com/gin-gonic/gin"
)

type TagRequest struct {
	ShortID string `json:"shortID"`
	Tag     string `json:"tag"`
}

func AddTag(c *gin.Context) {
	var tagRequest TagRequest

	if err := c.ShouldBind(&tagRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Request Body"})
		return
	}

	shortId := tagRequest.ShortID
	tag := tagRequest.Tag

	r := database.CreateClient(0)
	defer r.Close()

	val, err := r.Get(database.Ctx, shortId).Result()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data not found for given short id"})
		return
	}

	var data map[string]interface{}
	if err := json.Unmarshal([]byte(val), &data); err != nil {
		// if data is a string
		data = make(map[string]interface{})
		data["data"] = val
	}

	var tags []string
	if existingTag, ok := data["tags"].([]interface{}); ok {
		for _, t := range existingTag {
			if strTag, ok := t.(string); ok {
				tags = append(tags, strTag)
			}
		}
	}

	//check for duplicate
	for _, existingTag := range tags {
		if existingTag == tag {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Tag already exists"})
			return
		}
	}

	// add new tag to tag slice

	tags = append(tags, tag)
	data["tags"] = tags

	// marshal the updated data back to json
	updatedData, err := json.Marshal(data)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal updated data"})
		return
	}

	err = r.Set(database.Ctx, shortId, updatedData, 0).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update the database"})
		return
	}

	// response with updated data
	c.JSON(http.StatusOK, data)
}
