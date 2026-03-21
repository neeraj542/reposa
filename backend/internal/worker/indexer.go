package worker

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/neeraj542/reposa/internal/models"
	"github.com/neeraj542/reposa/internal/storage"
)

// externalOrg represents the minimal format returned by api.gsocorganizations.dev
type externalOrg struct {
	Name         string                 `json:"name"`
	Description  string                 `json:"description"`
	Category     string                 `json:"category"`
	Technologies []string               `json:"technologies"`
	ImageURL     string                 `json:"image_url"`
	URL          string                 `json:"url"`
	IsFirstTime  bool                   `json:"is_first_time"`
	Years        map[string]interface{} `json:"years"`
}

// Indexer manages background syncing of open source program data
type Indexer struct {
	store *storage.Storage
}

// NewIndexer creates a new background worker
func NewIndexer(store *storage.Storage) *Indexer {
	return &Indexer{store: store}
}

// Start begins the periodic syncing process
func (w *Indexer) Start() {
	log.Println("🚀 Starting background Indexer worker...")

	// Run an initial sync immediately in a goroutine
	go w.SyncGSoCOrganizations()

	// Then schedule it to run every 24 hours
	ticker := time.NewTicker(24 * time.Hour)
	go func() {
		for range ticker.C {
			w.SyncGSoCOrganizations()
		}
	}()
}

// SyncGSoCOrganizations fetches data from the unofficial GSoC API and upserts it to Postgres
func (w *Indexer) SyncGSoCOrganizations() {
	log.Println("[Indexer] Triggering GSoC Organization Sync...")

	// 1. Ensure the Program exists
	var program models.Program
	res := w.store.DB.Where("slug = ?", "gsoc").FirstOrCreate(&program, models.Program{
		Slug:        "gsoc",
		Name:        "Google Summer of Code",
		Description: "A global, online program focused on bringing new contributors into open source software development.",
		WebsiteURL:  "https://summerofcode.withgoogle.com/",
	})
	if res.Error != nil {
		log.Printf("[Indexer] Failed to create or find GSoC program: %v\n", res.Error)
		return
	}

	// For simplicity in this v2 architecture phase, we'll associate all organizations
	// under a single "latest" program edition (e.g., 2024 or 2025).
	// The real API handles historical data dynamically.
	currentYear := time.Now().Year()
	var edition models.ProgramEdition
	res = w.store.DB.Where("program_id = ? AND year = ?", program.ID, currentYear).FirstOrCreate(&edition, models.ProgramEdition{
		ProgramID: program.ID,
		Year:      currentYear,
	})
	if res.Error != nil {
		log.Printf("[Indexer] Failed to create or find GSoC ProgramEdition: %v\n", res.Error)
		return
	}

	// 2. Fetch data from external API
	url := "https://api.gsocorganizations.dev/organizations.json"
	resp, err := http.Get(url)
	if err != nil {
		log.Printf("[Indexer] Network error fetching GSoC data: %v\n", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("[Indexer] GSoC API returned status: %d\n", resp.StatusCode)
		return
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("[Indexer] Failed to read GSoC API response: %v\n", err)
		return
	}

	var orgs []externalOrg
	if err := json.Unmarshal(bodyBytes, &orgs); err != nil {
		log.Printf("[Indexer] Failed to parse GSoC JSON: %v\n", err)
		return
	}

	log.Printf("[Indexer] Fetched %d organizations. Starting upsert...", len(orgs))

	// 3. Upsert Records
	upsertCount := 0
	for _, extOrg := range orgs {
		// Convert arrays to comma-separated strings for our simple schema
		techStr := strings.Join(extOrg.Technologies, ",")

		var yearStrs []string
		for yearKey := range extOrg.Years {
			yearStrs = append(yearStrs, yearKey)
		}
		yearsStr := strings.Join(yearStrs, ",")

		// Generate a slug from the name
		slug := strings.ToLower(strings.ReplaceAll(extOrg.Name, " ", "-"))

		org := models.Organization{
			ProgramEditionID: edition.ID,
			Slug:             slug,
			Name:             extOrg.Name,
			Description:      extOrg.Description,
			WebsiteURL:       extOrg.URL,
			LogoURL:          extOrg.ImageURL,
			Category:         extOrg.Category,
			Technologies:     techStr,
			IsFirstTime:      extOrg.IsFirstTime,
			// Since we just have generic JSON data, we store the years as a string representation
			Repositories: yearsStr, // Quick hack: Repositories field repurposed as years_active in string form to avoid altering array schemas during rapid prototyping
		}

		// Upsert logic based on Slug + Edition
		var existing models.Organization
		if err := w.store.DB.Where("slug = ? AND program_edition_id = ?", slug, edition.ID).First(&existing).Error; err != nil {
			// Not found -> create
			w.store.DB.Create(&org)
			upsertCount++
		} else {
			// Found -> update
			existing.Description = org.Description
			existing.LogoURL = org.LogoURL
			existing.Technologies = org.Technologies
			existing.IsFirstTime = org.IsFirstTime
			existing.Category = org.Category
			w.store.DB.Save(&existing)
			upsertCount++
		}
	}

	log.Printf("✅ [Indexer] Sync complete. Upserted %d GSoC organizations.", upsertCount)
}
