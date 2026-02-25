package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	"github.com/neeraj542/reposa/internal/storage"
	"github.com/neeraj542/reposa/internal/worker"
)

func main() {
	// enhanced logging
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found or unable to load: %v", err)
	}

	// Initialize Storage
	store, err := storage.NewStorage()
	if err != nil {
		log.Fatalf("Critical: Failed to initialize storage for worker: %v", err)
	}

	// Start Indexer
	idxWorker := worker.NewIndexer(store)
	idxWorker.Start()

	log.Println("✅ Worker is running. Press Ctrl+C to stop.")

	// Wait for interrupt signal to gracefully shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down worker...")
}
