package analyzer

import (
	"strings"
	"time"

	"github.com/google/go-github/v58/github"
	"github.com/neeraj542/reposa/internal/models"
)

// Analyzer handles the analysis of GitHub repositories
type Analyzer struct{}

// NewAnalyzer creates a new Analyzer instance
func NewAnalyzer() *Analyzer {
	return &Analyzer{}
}

// AnalyzeRepository analyzes a GitHub repository and its issues
func (a *Analyzer) AnalyzeRepository(repo *github.Repository, issues []*github.Issue, languages []string) *models.Analysis {
	// Convert repository
	repository := a.convertRepository(repo, languages)

	// Convert and categorize issues
	analyzedIssues := a.analyzeIssues(issues)

	// Calculate statistics
	stats := a.calculateStats(analyzedIssues)

	return &models.Analysis{
		ID:         generateID(),
		Repository: repository,
		Issues:     analyzedIssues,
		Stats:      stats,
		CreatedAt:  time.Now(),
	}
}

// convertRepository converts GitHub repository to our model
func (a *Analyzer) convertRepository(repo *github.Repository, languages []string) models.Repository {
	description := ""
	if repo.Description != nil {
		description = *repo.Description
	}

	topics := []string{}
	if repo.Topics != nil {
		topics = repo.Topics
	}

	return models.Repository{
		ID:          repo.GetNodeID(),
		Name:        repo.GetName(),
		Owner:       repo.GetOwner().GetLogin(),
		FullName:    repo.GetFullName(),
		Description: description,
		URL:         repo.GetHTMLURL(),
		Stars:       repo.GetStargazersCount(),
		Forks:       repo.GetForksCount(),
		Languages:   languages,
		Topics:      topics,
		CreatedAt:   repo.GetCreatedAt().Time,
		UpdatedAt:   repo.GetUpdatedAt().Time,
	}
}

// analyzeIssues converts and categorizes GitHub issues
func (a *Analyzer) analyzeIssues(issues []*github.Issue) []models.Issue {
	var analyzed []models.Issue

	for _, issue := range issues {
		// Skip pull requests
		if issue.PullRequestLinks != nil {
			continue
		}

		labels := extractLabels(issue.Labels)

		analyzed = append(analyzed, models.Issue{
			ID:          issue.GetID(),
			Number:      issue.GetNumber(),
			Title:       issue.GetTitle(),
			Body:        issue.GetBody(),
			URL:         issue.GetHTMLURL(),
			State:       issue.GetState(),
			Labels:      labels,
			Difficulty:  determineDifficulty(labels),
			Type:        determineType(labels),
			IsGoodFirst: hasLabel(labels, "good first issue"),
			HasMentor:   hasLabel(labels, "mentor available") || hasLabel(labels, "mentorship"),
			CreatedAt:   issue.GetCreatedAt().Time,
			UpdatedAt:   issue.GetUpdatedAt().Time,
		})
	}

	return analyzed
}

// calculateStats calculates statistics from analyzed issues
func (a *Analyzer) calculateStats(issues []models.Issue) models.Stats {
	stats := models.Stats{
		TotalIssues: len(issues),
	}

	for _, issue := range issues {
		if issue.IsGoodFirst {
			stats.GoodFirstIssues++
		}
		if hasLabel(issue.Labels, "help wanted") {
			stats.HelpWantedIssues++
		}

		switch issue.Type {
		case "bug":
			stats.BugIssues++
		case "feature":
			stats.FeatureIssues++
		case "docs":
			stats.DocsIssues++
		}
	}

	return stats
}

// extractLabels extracts label names from GitHub labels
func extractLabels(labels []*github.Label) []string {
	var result []string
	for _, label := range labels {
		result = append(result, label.GetName())
	}
	return result
}

// determineDifficulty determines issue difficulty from labels
func determineDifficulty(labels []string) string {
	for _, label := range labels {
		lower := strings.ToLower(label)
		if strings.Contains(lower, "difficulty/easy") || strings.Contains(lower, "level/easy") {
			return "easy"
		}
		if strings.Contains(lower, "difficulty/medium") || strings.Contains(lower, "level/medium") {
			return "medium"
		}
		if strings.Contains(lower, "difficulty/hard") || strings.Contains(lower, "level/hard") {
			return "hard"
		}
		if strings.Contains(lower, "good first issue") {
			return "easy"
		}
	}
	return ""
}

// determineType determines issue type from labels
func determineType(labels []string) string {
	for _, label := range labels {
		lower := strings.ToLower(label)
		if strings.Contains(lower, "bug") {
			return "bug"
		}
		if strings.Contains(lower, "feature") {
			return "feature"
		}
		if strings.Contains(lower, "enhancement") || strings.Contains(lower, "improvement") {
			return "enhancement"
		}
		if strings.Contains(lower, "docs") || strings.Contains(lower, "documentation") {
			return "docs"
		}
	}
	return ""
}

// hasLabel checks if a label exists in the list (case-insensitive)
func hasLabel(labels []string, target string) bool {
	target = strings.ToLower(target)
	for _, label := range labels {
		if strings.ToLower(label) == target {
			return true
		}
	}
	return false
}

// generateID generates a unique ID for the analysis
func generateID() string {
	return time.Now().Format("20060102150405")
}
