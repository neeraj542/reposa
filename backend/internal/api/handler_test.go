package api

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
)

func TestGetHealth(t *testing.T) {
	app := fiber.New()
	handler := NewHandler(nil)
	app.Get("/health", handler.GetHealth)

	req := httptest.NewRequest("GET", "/health", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Failed to test health endpoint: %v", err)
	}

	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("Expected status OK, got %d", resp.StatusCode)
	}

	body, _ := io.ReadAll(resp.Body)
	var result map[string]string
	json.Unmarshal(body, &result)

	if result["status"] != "healthy" {
		t.Errorf("Expected status healthy, got %s", result["status"])
	}
	if result["service"] != "reposa" {
		t.Errorf("Expected service reposa, got %s", result["service"])
	}
}

func TestAnalyzeRepository_InvalidRequest(t *testing.T) {
	app := fiber.New()
	handler := NewHandler(nil)
	app.Post("/analyze", handler.AnalyzeRepository)

	// Test with empty body
	req := httptest.NewRequest("POST", "/analyze", nil)
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	if resp.StatusCode != fiber.StatusBadRequest {
		t.Errorf("Expected status Bad Request for empty body, got %d", resp.StatusCode)
	}

	// Test with invalid URL
	payload := []byte(`{"repo_url": ""}`)
	req = httptest.NewRequest("POST", "/analyze", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = app.Test(req)

	if resp.StatusCode != fiber.StatusBadRequest {
		t.Errorf("Expected status Bad Request for empty URL, got %d", resp.StatusCode)
	}
}
