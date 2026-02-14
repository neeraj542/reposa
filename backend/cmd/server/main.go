package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	"github.com/neeraj542/reposa/internal/api"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found or unable to load: %v", err)
	}

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName: "Reposa v1.0.0",
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"error": err.Error(),
			})
		},
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New())

	// Initialize handler
	handler := api.NewHandler()

	// Health check endpoint
	app.Get("/health", handler.GetHealth)

	// API routes
	apiGroup := app.Group("/api")
	apiGroup.Post("/analyze", handler.AnalyzeRepository)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	// Start server
	log.Printf("🚀 Reposa server starting on port %s", port)
	log.Printf("📝 Endpoints:")
	log.Printf("   GET  /health")
	log.Printf("   POST /api/analyze")

	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
