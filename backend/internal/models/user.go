package models

import (
	"time"

	"github.com/neeraj542/reposa/internal/crypto"
	"gorm.io/gorm"
)

// User represents a registered user in Reposa
type User struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	GitHubID    int64     `json:"github_id" gorm:"column:github_id;uniqueIndex;not null"`
	Username    string    `json:"username" gorm:"size:100;not null"`
	Email       string    `json:"email"`
	AvatarURL   string    `json:"avatar_url" gorm:"type:text"`
	GitHubToken string    `json:"-" gorm:"column:github_token;type:text;not null"` // Encrypted in DB
	LastLogin   time.Time `json:"last_login"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// BeforeSave encrypts the GitHubToken before saving to the database
func (u *User) BeforeSave(tx *gorm.DB) (err error) {
	if u.GitHubToken != "" {
		encrypted, err := crypto.Encrypt(u.GitHubToken)
		if err != nil {
			return err
		}
		u.GitHubToken = encrypted
	}
	return
}

// AfterFind decrypts the GitHubToken after retrieving from the database
func (u *User) AfterFind(tx *gorm.DB) (err error) {
	if u.GitHubToken != "" {
		decrypted, err := crypto.Decrypt(u.GitHubToken)
		if err != nil {
			// If decryption fails, it might be a legacy token from before encryption was added.
			// Returning the error is strictly safer, but for migration purposes we could log it.
			return err
		}
		u.GitHubToken = decrypted
	}
	return
}
