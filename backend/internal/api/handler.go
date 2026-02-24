package api

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/neeraj542/reposa/internal/analyzer"
	"github.com/neeraj542/reposa/internal/github"
	"github.com/neeraj542/reposa/internal/models"
	"github.com/neeraj542/reposa/internal/storage"
)

// Handler handles API requests
type Handler struct {
	githubClient *github.Client
	analyzer     *analyzer.Analyzer
	storage      *storage.Storage
}

// NewHandler creates a new API handler
func NewHandler(s *storage.Storage) *Handler {
	token := os.Getenv("GITHUB_TOKEN")
	if token == "" {
		log.Println("Warning: GITHUB_TOKEN not set. API rate limits will be restricted.")
	}

	return &Handler{
		githubClient: github.NewClient(token),
		analyzer:     analyzer.NewAnalyzer(),
		storage:      s,
	}
}

// AnalyzeRepository handles the analyze repository request
func (h *Handler) AnalyzeRepository(c *fiber.Ctx) error {
	var req models.AnalyzeRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":      "Invalid request body",
			"error_type": "invalid_request",
			"message":    "The request body is malformed. Please check your input.",
		})
	}

	// Validate URL
	if req.RepoURL == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":      "repo_url is required",
			"error_type": "invalid_request",
			"message":    "Please provide a valid GitHub repository URL.",
		})
	}

	// Parse repository URL
	owner, repo, err := github.ParseRepoURL(req.RepoURL)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":      "Invalid GitHub repository URL",
			"error_type": "invalid_url",
			"message":    "The URL format is invalid. Please use: https://github.com/owner/repo",
		})
	}

	// Determine GitHub client to use (Personal token from session or default token)
	ghClient := h.githubClient
	userID := c.Locals("user_id")
	if userID != nil {
		user, err := h.storage.GetUserByID(userID.(uint))
		if err == nil && user.GitHubToken != "" {
			ghClient = github.NewClient(user.GitHubToken)
			log.Printf("Using personal token for analysis of %s/%s by user %s", owner, repo, user.Username)
		}
	}

	// Fetch repository information
	repository, err := ghClient.GetRepository(owner, repo)
	if err != nil {
		log.Printf("Repository fetch error: %v", err)
		if strings.Contains(err.Error(), "rate_limit_exceeded") {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error":      "GitHub API rate limit exceeded",
				"error_type": "rate_limit",
				"message":    "We've hit the GitHub API rate limit. Please try again later or log in to use your personal token.",
			})
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error":      "Repository not found or unable to access",
			"error_type": "repo_not_found",
			"message":    fmt.Sprintf("We couldn't find the repository '%s/%s'. It may be private, deleted, or doesn't exist.", owner, repo),
		})
	}

	// Check if issues are enabled
	if repository.HasIssues != nil && !*repository.HasIssues {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":      "Issues are disabled for this repository",
			"error_type": "no_issues",
			"message":    fmt.Sprintf("The repository '%s/%s' has disabled the issues feature. Try a repository that actively uses GitHub Issues.", owner, repo),
		})
	}

	// Fetch issues
	issues, err := ghClient.GetIssues(owner, repo)
	if err != nil {
		log.Printf("Issues fetch error: %v", err)
		if strings.Contains(err.Error(), "rate_limit_exceeded") {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error":      "GitHub API rate limit exceeded",
				"error_type": "rate_limit",
				"message":    "We've hit the GitHub API rate limit. Please try again later or configure a GITHUB_TOKEN.",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":      "Failed to fetch issues",
			"error_type": "api_error",
			"message":    "We encountered an error while fetching issues. This might be a temporary GitHub API issue. Please try again.",
		})
	}

	// Fetch languages
	languages, err := ghClient.GetLanguages(owner, repo)
	if err != nil {
		log.Printf("Warning: Failed to fetch languages: %v", err)
		languages = []string{}
	}

	// Analyze repository
	analysis := h.analyzer.AnalyzeRepository(repository, issues, languages)

	// Check if we found any beginner-friendly issues
	if len(analysis.Issues) == 0 {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error":      "No beginner-friendly issues found",
			"error_type": "no_beginner_issues",
			"message":    fmt.Sprintf("The repository '%s/%s' doesn't have any issues marked as beginner-friendly. Try looking for repositories with 'good first issue' labels.", owner, repo),
		})
	}

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

// GetGsocOrganizations proxies requests to gsocorganizations.dev API
func (h *Handler) GetGsocOrganizations(c *fiber.Ctx) error {
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := client.Get("https://api.gsocorganizations.dev/organizations.json")
	if err != nil {
		log.Printf("GSoC API fetch error: %v", err)
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"error":   "Failed to fetch GSoC organizations",
			"message": "The upstream GSoC Organizations API is currently unavailable.",
		})
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return c.Status(resp.StatusCode).JSON(fiber.Map{
			"error": "Upstream API error",
		})
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to read response body",
		})
	}

	// Forward the raw JSON to the frontend
	c.Set("Content-Type", "application/json")
	return c.Send(body)
}
