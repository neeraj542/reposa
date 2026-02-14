package github

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/go-github/v58/github"
	"golang.org/x/oauth2"
)

// Client wraps the GitHub API client
type Client struct {
	client *github.Client
	ctx    context.Context
}

// NewClient creates a new GitHub API client
func NewClient(token string) *Client {
	ctx := context.Background()

	var client *github.Client
	if token != "" {
		ts := oauth2.StaticTokenSource(
			&oauth2.Token{AccessToken: token},
		)
		tc := oauth2.NewClient(ctx, ts)
		client = github.NewClient(tc)
	} else {
		client = github.NewClient(nil)
	}

	return &Client{
		client: client,
		ctx:    ctx,
	}
}

// ParseRepoURL extracts owner and repo name from GitHub URL
func ParseRepoURL(url string) (owner, repo string, err error) {
	// Remove trailing slash
	url = strings.TrimSuffix(url, "/")

	// Handle different URL formats
	// https://github.com/owner/repo
	// github.com/owner/repo
	// owner/repo

	url = strings.TrimPrefix(url, "https://")
	url = strings.TrimPrefix(url, "http://")
	url = strings.TrimPrefix(url, "github.com/")

	parts := strings.Split(url, "/")
	if len(parts) < 2 {
		return "", "", fmt.Errorf("invalid GitHub URL format")
	}

	owner = parts[0]
	repo = parts[1]

	return owner, repo, nil
}

// GetRepository fetches repository information
func (c *Client) GetRepository(owner, repo string) (*github.Repository, error) {
	repository, resp, err := c.client.Repositories.Get(c.ctx, owner, repo)
	if err != nil {
		// Check for rate limiting
		if resp != nil && resp.StatusCode == 403 {
			return nil, fmt.Errorf("rate_limit_exceeded: GitHub API rate limit exceeded")
		}
		return nil, fmt.Errorf("failed to fetch repository: %w", err)
	}
	return repository, nil
}

// GetIssues fetches issues from a repository with filters
func (c *Client) GetIssues(owner, repo string) ([]*github.Issue, error) {
	opts := &github.IssueListByRepoOptions{
		State:  "open",
		Labels: []string{"help wanted"},
		ListOptions: github.ListOptions{
			PerPage: 100,
		},
	}

	var allIssues []*github.Issue
	for {
		issues, resp, err := c.client.Issues.ListByRepo(c.ctx, owner, repo, opts)
		if err != nil {
			// Check for rate limiting
			if resp != nil && resp.StatusCode == 403 {
				return nil, fmt.Errorf("rate_limit_exceeded: GitHub API rate limit exceeded")
			}
			// Check if issues are disabled (HTTP 410 Gone)
			if resp != nil && resp.StatusCode == 410 {
				return []*github.Issue{}, nil
			}
			return nil, fmt.Errorf("failed to fetch issues: %w", err)
		}

		allIssues = append(allIssues, issues...)

		if resp.NextPage == 0 {
			break
		}
		opts.Page = resp.NextPage
	}

	return allIssues, nil
}

// GetLanguages fetches programming languages used in the repository
func (c *Client) GetLanguages(owner, repo string) ([]string, error) {
	languages, _, err := c.client.Repositories.ListLanguages(c.ctx, owner, repo)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch languages: %w", err)
	}

	var langs []string
	for lang := range languages {
		langs = append(langs, lang)
	}

	return langs, nil
}
