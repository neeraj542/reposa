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
	"github.com/neeraj542/reposa/internal/storage"
)

func main() {
	// enhanced logging
	log.SetFlags(log.LstdFlags | log.Lshortfile)
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
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${latency} ${method} ${path}\n",
	}))
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     os.Getenv("FRONTEND_URL"),
	}))

	// Initialize Storage
	store, err := storage.NewStorage()
	if err != nil {
		log.Printf("Warning: Failed to initialize storage: %v. Persistance will be disabled.", err)
	}

	// Initialize handlers
	handler := api.NewHandler(store)
	authHandler := api.NewAuthHandler(store)

	// Health check endpoint
	app.Get("/health", handler.GetHealth)

	// Auth routes
	auth := app.Group("/auth")
	auth.Get("/github", authHandler.GithubLogin)
	auth.Get("/github/callback", authHandler.GithubCallback)
	auth.Post("/logout", authHandler.Logout)
	auth.Get("/me", api.Protected, authHandler.GetMe)

	// API routes
	apiGroup := app.Group("/api")
	apiGroup.Post("/analyze", api.OptionalProtected, handler.AnalyzeRepository)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	// Start server
	log.Printf("Reposa server starting on port %s", port)
	log.Printf("Endpoints:")
	log.Printf("   GET  /health")
	log.Printf("   POST /api/analyze")
	log.Printf("   GET  /auth/github")
	log.Printf("   GET  /auth/me")

	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
