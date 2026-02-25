package storage

import (
	"fmt"
	"log"
	"os"

	"github.com/neeraj542/reposa/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Storage handles interaction with the database
type Storage struct {
	DB *gorm.DB
}

// NewStorage initializes a new PostgreSQL storage instance
func NewStorage() (*Storage, error) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return nil, fmt.Errorf("DATABASE_URL environment variable is not set")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Auto-migrate the schema
	err = db.AutoMigrate(
		&models.User{},
		&models.Program{},
		&models.ProgramEdition{},
		&models.Organization{},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to run auto-migration: %w", err)
	}

	log.Println("✅ Database connection established and migrations completed")
	return &Storage{DB: db}, nil
}

// CreateOrUpdateUser creates a new user or updates an existing one based on GitHubID
func (s *Storage) CreateOrUpdateUser(user *models.User) error {
	var existingUser models.User
	result := s.DB.Where("github_id = ?", user.GitHubID).First(&existingUser)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			// Create new user
			err := s.DB.Create(user).Error
			if err != nil {
				log.Printf("Error creating user: %v", err)
				return err
			}
			return nil
		}
		log.Printf("Error finding user: %v", result.Error)
		return result.Error
	}

	// Update existing user
	existingUser.Username = user.Username
	existingUser.Email = user.Email
	existingUser.AvatarURL = user.AvatarURL
	existingUser.GitHubToken = user.GitHubToken
	existingUser.LastLogin = user.LastLogin

	err := s.DB.Save(&existingUser).Error
	if err != nil {
		log.Printf("Error updating user: %v", err)
		return err
	}
	return nil
}

// GetUserByID fetches a user by their database ID
func (s *Storage) GetUserByID(id uint) (*models.User, error) {
	var user models.User
	err := s.DB.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
