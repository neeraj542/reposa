package models

import "time"

// Repository represents a GitHub repository
type Repository struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Owner       string    `json:"owner"`
	FullName    string    `json:"full_name"`
	Description string    `json:"description"`
	URL         string    `json:"url"`
	Stars       int       `json:"stars"`
	Forks       int       `json:"forks"`
	Languages   []string  `json:"languages"`
	Topics      []string  `json:"topics"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Issue represents a GitHub issue
type Issue struct {
	ID          int64     `json:"id"`
	Number      int       `json:"number"`
	Title       string    `json:"title"`
	Body        string    `json:"body"`
	URL         string    `json:"url"`
	State       string    `json:"state"`
	Labels      []string  `json:"labels"`
	Difficulty  string    `json:"difficulty,omitempty"` // easy, medium, hard
	Type        string    `json:"type,omitempty"`       // bug, feature, enhancement, docs
	IsGoodFirst bool      `json:"is_good_first"`
	HasMentor   bool      `json:"has_mentor"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Analysis represents the complete analysis of a repository
type Analysis struct {
	ID         string     `json:"id"`
	Repository Repository `json:"repository"`
	Issues     []Issue    `json:"issues"`
	Stats      Stats      `json:"stats"`
	CreatedAt  time.Time  `json:"created_at"`
}

// Stats represents statistics about the analysis
type Stats struct {
	TotalIssues      int `json:"total_issues"`
	GoodFirstIssues  int `json:"good_first_issues"`
	HelpWantedIssues int `json:"help_wanted_issues"`
	BugIssues        int `json:"bug_issues"`
	FeatureIssues    int `json:"feature_issues"`
	DocsIssues       int `json:"docs_issues"`
}

// AnalyzeRequest represents the request to analyze a repository
type AnalyzeRequest struct {
	RepoURL string `json:"repo_url" validate:"required,url"`
}

// AnalyzeResponse represents the response from analyzing a repository
type AnalyzeResponse struct {
	ID      string `json:"id"`
	Message string `json:"message"`
}
