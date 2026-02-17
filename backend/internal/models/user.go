package models

import (
	"time"
)

// User represents a registered user in Reposa
type User struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	GitHubID    int64     `json:"github_id" gorm:"column:github_id;uniqueIndex;not null"`
	Username    string    `json:"username" gorm:"size:100;not null"`
	Email       string    `json:"email"`
	AvatarURL   string    `json:"avatar_url" gorm:"type:text"`
	GitHubToken string    `json:"-" gorm:"column:github_token;type:text;not null"` // Access token for GitHub API (should be encrypted in a real production app)
	LastLogin   time.Time `json:"last_login"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
