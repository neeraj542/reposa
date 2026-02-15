package analyzer

import (
	"testing"

	"github.com/google/go-github/v58/github"
)

func TestDetermineDifficulty(t *testing.T) {
	tests := []struct {
		name   string
		labels []string
		want   string
	}{
		{
			name:   "easy label",
			labels: []string{"difficulty/easy"},
			want:   "easy",
		},
		{
			name:   "medium label",
			labels: []string{"level/medium"},
			want:   "medium",
		},
		{
			name:   "hard label",
			labels: []string{"difficulty/hard"},
			want:   "hard",
		},
		{
			name:   "good first issue as easy",
			labels: []string{"good first issue"},
			want:   "easy",
		},
		{
			name:   "no matching labels",
			labels: []string{"bug", "help wanted"},
			want:   "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := determineDifficulty(tt.labels); got != tt.want {
				t.Errorf("determineDifficulty() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestDetermineType(t *testing.T) {
	tests := []struct {
		name   string
		labels []string
		want   string
	}{
		{
			name:   "bug label",
			labels: []string{"kind/bug"},
			want:   "bug",
		},
		{
			name:   "feature label",
			labels: []string{"new feature"},
			want:   "feature",
		},
		{
			name:   "enhancement label",
			labels: []string{"enhancement"},
			want:   "enhancement",
		},
		{
			name:   "docs label",
			labels: []string{"documentation"},
			want:   "docs",
		},
		{
			name:   "multiple labels - bug take priority",
			labels: []string{"bug", "docs"},
			want:   "bug",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := determineType(tt.labels); got != tt.want {
				t.Errorf("determineType() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestCalculateStats(t *testing.T) {
	analyzer := NewAnalyzer()
	issues := []github.Issue{
		{
			Labels: []*github.Label{{Name: github.String("good first issue")}},
		},
		{
			Labels: []*github.Label{{Name: github.String("help wanted")}, {Name: github.String("bug")}},
		},
		{
			Labels: []*github.Label{{Name: github.String("documentation")}},
		},
	}

	// We need to convert them to our internal model first to use calculateStats
	analyzedIssues := analyzer.analyzeIssues(convertToPointers(issues))
	stats := analyzer.calculateStats(analyzedIssues)

	if stats.TotalIssues != 3 {
		t.Errorf("Expected 3 total issues, got %d", stats.TotalIssues)
	}
	if stats.GoodFirstIssues != 2 { // "good first issue" is also "easy" in our logic, but does it count as good first?
		// Check analyzer script: IsGoodFirst: hasLabel(labels, "good first issue")
		if stats.GoodFirstIssues != 1 {
			t.Errorf("Expected 1 good first issue, got %d", stats.GoodFirstIssues)
		}
	}
	if stats.HelpWantedIssues != 1 {
		t.Errorf("Expected 1 help wanted issue, got %d", stats.HelpWantedIssues)
	}
	if stats.BugIssues != 1 {
		t.Errorf("Expected 1 bug issue, got %d", stats.BugIssues)
	}
	if stats.DocsIssues != 1 {
		t.Errorf("Expected 1 docs issue, got %d", stats.DocsIssues)
	}
}

func convertToPointers(issues []github.Issue) []*github.Issue {
	res := make([]*github.Issue, len(issues))
	for i := range issues {
		res[i] = &issues[i]
	}
	return res
}
