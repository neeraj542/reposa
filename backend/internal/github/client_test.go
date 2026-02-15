package github

import "testing"

func TestParseRepoURL(t *testing.T) {
	tests := []struct {
		name      string
		url       string
		wantOwner string
		wantRepo  string
		wantErr   bool
	}{
		{
			name:      "standard https url",
			url:       "https://github.com/owner/repo",
			wantOwner: "owner",
			wantRepo:  "repo",
			wantErr:   false,
		},
		{
			name:      "https url with trailing slash",
			url:       "https://github.com/owner/repo/",
			wantOwner: "owner",
			wantRepo:  "repo",
			wantErr:   false,
		},
		{
			name:      "http url",
			url:       "http://github.com/owner/repo",
			wantOwner: "owner",
			wantRepo:  "repo",
			wantErr:   false,
		},
		{
			name:      "url without protocol",
			url:       "github.com/owner/repo",
			wantOwner: "owner",
			wantRepo:  "repo",
			wantErr:   false,
		},
		{
			name:      "simple owner/repo format",
			url:       "owner/repo",
			wantOwner: "owner",
			wantRepo:  "repo",
			wantErr:   false,
		},
		{
			name:      "invalid url",
			url:       "just-a-string",
			wantOwner: "",
			wantRepo:  "",
			wantErr:   true,
		},
		{
			name:      "empty string",
			url:       "",
			wantOwner: "",
			wantRepo:  "",
			wantErr:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotOwner, gotRepo, err := ParseRepoURL(tt.url)
			if (err != nil) != tt.wantErr {
				t.Errorf("ParseRepoURL() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if gotOwner != tt.wantOwner {
				t.Errorf("ParseRepoURL() gotOwner = %v, want %v", gotOwner, tt.wantOwner)
			}
			if gotRepo != tt.wantRepo {
				t.Errorf("ParseRepoURL() gotRepo = %v, want %v", gotRepo, tt.wantRepo)
			}
		})
	}
}
