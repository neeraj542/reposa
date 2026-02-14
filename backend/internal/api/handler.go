package api

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/neeraj542/reposa/internal/analyzer"
	"github.com/neeraj542/reposa/internal/github"
	"github.com/neeraj542/reposa/internal/models"
)

// Handler handles API requests
type Handler struct {
	githubClient *github.Client
	analyzer     *analyzer.Analyzer
}

// NewHandler creates a new API handler
func NewHandler() *Handler {
	token := os.Getenv("GITHUB_TOKEN")
	if token == "" {
		log.Println("Warning: GITHUB_TOKEN not set. API rate limits will be restricted.")
	}

	return &Handler{
		githubClient: github.NewClient(token),
		analyzer:     analyzer.NewAnalyzer(),
	}
}

// AnalyzeRepository handles the analyze repository request
func (h *Handler) AnalyzeRepository(c *fiber.Ctx) error {
	var req models.AnalyzeRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate URL
	if req.RepoURL == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "repo_url is required",
		})
	}

	// Parse repository URL
	owner, repo, err := github.ParseRepoURL(req.RepoURL)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid GitHub repository URL",
		})
	}

	// Fetch repository information
	repository, err := h.githubClient.GetRepository(owner, repo)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Repository not found or unable to access",
		})
	}

	// Fetch issues
	issues, err := h.githubClient.GetIssues(owner, repo)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch issues",
		})
	}

	// Fetch languages
	languages, err := h.githubClient.GetLanguages(owner, repo)
	if err != nil {
		log.Printf("Warning: Failed to fetch languages: %v", err)
		languages = []string{}
	}

	// Analyze repository
	analysis := h.analyzer.AnalyzeRepository(repository, issues, languages)

	return c.JSON(analysis)
}

// GetHealth handles health check requests
func (h *Handler) GetHealth(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":  "healthy",
		"service": "reposa",
		"version": "1.0.0",
	})
}
