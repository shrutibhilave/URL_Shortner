package utils

import (
	"os"
	"strings"
)

func IsDifferentDomain(url string) bool {
	domain := os.Getenv("DOMAIN")

	if url == domain {
		return false
	}

	clearURL := strings.TrimPrefix(url, "http://")
	clearURL = strings.TrimPrefix(url, "https://")
	clearURL = strings.TrimPrefix(url, "www.")
	clearURL = strings.Split(url, "/")[0]

	return clearURL != domain
}

func EnsureHttpPrefix(url string) string {
	if !strings.HasPrefix(url, "http://") || !strings.HasPrefix(url, "https://") {
		return url
	}

	return url
}
