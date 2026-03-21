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

	// Replicate exactly what auth.go does
	user := &models.User{
		GitHubID:    11223344, // Some realistic ID
		Username:    "test_founder",
		Email:       "founder@example.com",
		AvatarURL:   "https://avatars.githubusercontent.com/u/11223344?v=4",
		GitHubToken: "gho_dummy_token_for_testing_oauth_flow",
		LastLogin:   time.Now(),
	}

	// 1. First time creation
	err = store.CreateOrUpdateUser(user)
	if err != nil {
		log.Fatalf("ERROR on CREATE: %v", err)
	}
	fmt.Println("✅ First CreateOrUpdateUser passed.")

	// Simulate getting new token later
	user.GitHubToken = "gho_new_token_123"
	user.LastLogin = time.Now()

	// 2. Second time update
	err = store.CreateOrUpdateUser(user)
	if err != nil {
		log.Fatalf("ERROR on UPDATE: %v", err)
	}
	fmt.Println("✅ Second CreateOrUpdateUser (Update) passed.")
}
