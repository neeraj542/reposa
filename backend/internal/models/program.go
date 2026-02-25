package models

import (
	"time"

	"gorm.io/gorm"
)

// Program represents an Open Source program (e.g., GSoC, LFX Mentorship)
type Program struct {
	ID          uint             `gorm:"primaryKey" json:"id"`
	Slug        string           `gorm:"uniqueIndex;not null" json:"slug"` // "gsoc", "lfx", "cncf"
	Name        string           `gorm:"not null" json:"name"`
	Description string           `json:"description"`
	LogoURL     string           `json:"logo_url"`
	WebsiteURL  string           `json:"website_url"`
	Editions    []ProgramEdition `json:"editions"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
	DeletedAt   gorm.DeletedAt   `gorm:"index" json:"-"`
}

// ProgramEdition represents a specific year/batch of a program (e.g., GSoC 2024)
type ProgramEdition struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	ProgramID     uint           `gorm:"not null" json:"program_id"`
	Year          int            `gorm:"not null" json:"year"`
	Organizations []Organization `json:"organizations"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
}

// Organization represents a company or project participating in a program edition
type Organization struct {
	ID               uint   `gorm:"primaryKey" json:"id"`
	ProgramEditionID uint   `gorm:"index;not null" json:"program_edition_id"` // changed to index for easier lookup
	Slug             string `gorm:"uniqueIndex;not null" json:"slug"`
	Name             string `gorm:"not null" json:"name"`
	Description      string `json:"description"`
	LogoURL          string `json:"logo_url"`
	WebsiteURL       string `json:"website_url"`

	// Rich Data for Ecosystem Indexing
	IsFirstTime   bool   `json:"is_first_time" gorm:"default:false"`
	Category      string `json:"category" gorm:"index"`
	Technologies  string `json:"technologies" gorm:"type:text"` // Comma-separated list
	IdeasURL      string `json:"ideas_url"`
	GuideURL      string `json:"guide_url"`
	GitHubOrgName string `json:"github_org_name" gorm:"index"`

	Repositories string    `gorm:"type:text" json:"repositories"` // Comma-separated list of repos
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
