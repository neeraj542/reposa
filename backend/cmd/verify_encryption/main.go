package main

import (
	"fmt"
	"log"
	"time"

	"github.com/joho/godotenv"
	"github.com/neeraj542/reposa/internal/models"
	"github.com/neeraj542/reposa/internal/storage"
)

func main() {
	godotenv.Load(".env")
	store, err := storage.NewStorage()
	if err != nil {
		log.Fatal(err)
	}

	// 1. Create a test user with a dummy token
	testUser := models.User{
		GitHubID:    123456789,
		Username:    "encryption_tester",
		GitHubToken: "ghp_super_secret_unencrypted_token_123",
		LastLogin:   time.Now(),
	}

	err = store.DB.Where("github_id = ?", testUser.GitHubID).FirstOrCreate(&testUser).Error
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("✅ User created successfully via GORM.")

	// 2. Read RAW from database to verify it is ciphertext
	var rawToken string
	err = store.DB.Raw("SELECT github_token FROM users WHERE github_id = ?", testUser.GitHubID).Scan(&rawToken).Error
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("🔒 RAW DB Token (should be base64 ciphertext): %s\n", rawToken)

	if rawToken == "ghp_super_secret_unencrypted_token_123" {
		log.Fatal("❌ ERROR: Token was stored in plaintext!")
	} else if rawToken != "" {
		fmt.Println("✅ Token is successfully encrypted at rest!")
	}

	// 3. Read via GORM to verify AfterFind decrypts it
	var fetchedUser models.User
	err = store.DB.Where("github_id = ?", testUser.GitHubID).First(&fetchedUser).Error
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("🔓 GORM Fetched Token (should be plaintext): %s\n", fetchedUser.GitHubToken)
	if fetchedUser.GitHubToken == "ghp_super_secret_unencrypted_token_123" {
		fmt.Println("✅ Token is successfully decrypted in memory!")
	} else {
		log.Fatal("❌ ERROR: Token decryption failed or did not match!")
	}
}
