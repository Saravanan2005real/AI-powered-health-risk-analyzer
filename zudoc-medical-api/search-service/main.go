package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"golang.org/x/sync/singleflight"
)

// CacheEntry stores response data and expiration time
type CacheEntry struct {
	Value      []byte
	Expiration time.Time
}

// SearchCache is a thread-safe TTL cache
type SearchCache struct {
	sync.RWMutex
	entries map[string]CacheEntry
	ttl     time.Duration
}

func NewSearchCache(ttl time.Duration) *SearchCache {
	cache := &SearchCache{
		entries: make(map[string]CacheEntry),
		ttl:     ttl,
	}
	// Start a background goroutine to clean up expired entries periodically
	go cache.startCleanupTicker(5 * time.Minute)
	return cache
}

func (c *SearchCache) Get(key string) ([]byte, bool) {
	c.RLock()
	defer c.RUnlock()
	entry, found := c.entries[key]
	if !found {
		return nil, false
	}
	if time.Now().After(entry.Expiration) {
		return nil, false
	}
	return entry.Value, true
}

func (c *SearchCache) Set(key string, val []byte) {
	c.Lock()
	defer c.Unlock()
	c.entries[key] = CacheEntry{
		Value:      val,
		Expiration: time.Now().Add(c.ttl),
	}
}

func (c *SearchCache) startCleanupTicker(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for range ticker.C {
		c.Lock()
		now := time.Now()
		for k, entry := range c.entries {
			if now.After(entry.Expiration) {
				delete(c.entries, k)
			}
		}
		c.Unlock()
	}
}

// OpenSearch structs for parsing results
type OpenSearchSource struct {
	ProductID   string `json:"product_id"`
	ProductName string `json:"product_name"`
	Marketer    string `json:"marketer"`
	Composition string `json:"composition"`
}

type OpenSearchHit struct {
	Source OpenSearchSource `json:"_source"`
}

type OpenSearchHits struct {
	Hits []OpenSearchHit `json:"hits"`
}

type OpenSearchResponse struct {
	Hits OpenSearchHits `json:"hits"`
}

type DrugSearchResult struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Marketer    string `json:"marketer"`
	Composition string `json:"composition"`
}

// Draft request & db mapping
type DraftRequest struct {
	PatientID string          `json:"patientId"`
	Data      json.RawMessage `json:"data"`
}

type Draft struct {
	ID        string          `json:"id"`
	PatientID string          `json:"patientId"`
	Data      json.RawMessage `json:"data"`
	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
}

// ProxyResponse represents standard response parameters saved/retrieved for singleflight proxy requests
type ProxyResponse struct {
	Body       []byte
	StatusCode int
	Header     http.Header
}

var (
	dbPool        *pgxpool.Pool
	searchCache   *SearchCache
	openSearchURL string
	snowstormURL  string
	httpClient    *http.Client
	sfGroup       singleflight.Group
)

func main() {
	// Load environment variables from .env
	if err := godotenv.Load(); err != nil {
		log.Println("Info: No .env file found, relying on system environment variables")
	}

	// Read config
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgresql://zudoc:zudoc@localhost:5432/zudoc?schema=public"
	}

	openSearchURL = os.Getenv("OPENSEARCH_URL")
	if openSearchURL == "" {
		openSearchURL = "http://localhost:9201/drugs/_search" // local fallback
	}

	snowstormURL = os.Getenv("SNOWSTORM_URL")
	if snowstormURL == "" {
		snowstormURL = "http://localhost:8080" // local fallback
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Printf("Starting service with configuration:\n - DATABASE_URL: %s\n - OPENSEARCH_URL: %s\n - SNOWSTORM_URL: %s\n - PORT: %s\n",
		dbURL, openSearchURL, snowstormURL, port)

	// Create HTTP client with tuned Transport parameters to enable reuse of idle TCP connections
	httpClient = &http.Client{
		Timeout: 10 * time.Second,
		Transport: &http.Transport{
			MaxIdleConns:        1000,
			MaxIdleConnsPerHost: 100,
			IdleConnTimeout:     90 * time.Second,
		},
	}

	// Create Cache (1-hour TTL since terminology & drug databases are mostly static)
	searchCache = NewSearchCache(1 * time.Hour)

	// Initialize Database Pool with tuned pool settings
	// Clean database URL to remove Prisma-specific query parameters (like schema) that pgx/PostgreSQL rejects
	if parsedDbURL, err := url.Parse(dbURL); err == nil {
		q := parsedDbURL.Query()
		if q.Has("schema") {
			q.Del("schema")
			parsedDbURL.RawQuery = q.Encode()
			dbURL = parsedDbURL.String()
		}
	}

	pgxConfig, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		log.Fatalf("Unable to parse database URL config: %v\n", err)
	}
	pgxConfig.MaxConns = 50
	pgxConfig.MinConns = 5
	pgxConfig.MaxConnIdleTime = 30 * time.Minute
	pgxConfig.MaxConnLifetime = 1 * time.Hour

	dbPool, err = pgxpool.NewWithConfig(context.Background(), pgxConfig)
	if err != nil {
		log.Fatalf("Unable to connect to database pool: %v\n", err)
	}
	defer dbPool.Close()

	// Perform ping check
	if err = dbPool.Ping(context.Background()); err != nil {
		log.Printf("Warning: Database ping failed: %v. Database operations might fail until connected.\n", err)
	} else {
		log.Println("Database connection established successfully.")
		initDatabase()
	}

	// Setup Fiber App
	app := fiber.New(fiber.Config{
		BodyLimit: 10 * 1024 * 1024, // 10MB limit
	})

	// Add CORS middleware
	app.Use(cors.New())

	// Route definitions
	app.Get("/search", handleSearch)
	app.Post("/api/drafts", handleSaveDraft)
	app.Get("/api/drafts/:patientId", handleGetDraft)
	app.Get("/api/*", handleSnowstormProxy)

	log.Fatal(app.Listen(":" + port))
}

func initDatabase() {
	query := `
	CREATE TABLE IF NOT EXISTS "Draft" (
		"id" TEXT PRIMARY KEY,
		"patientId" TEXT UNIQUE NOT NULL,
		"data" JSONB NOT NULL,
		"createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		"updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := dbPool.Exec(context.Background(), query)
	if err != nil {
		log.Printf("Warning: Failed to ensure Draft table exists: %v", err)
	} else {
		log.Println("Database schema check complete: 'Draft' table is ready.")
	}
}

// handleSearch performs drug search against OpenSearch with query caching and coalescing
func handleSearch(c *fiber.Ctx) error {
	query := strings.TrimSpace(c.Query("q"))
	
	if len(query) < 3 {
		return c.JSON([]interface{}{})
	}
	
	cacheKey := "drug:" + query
	if cachedVal, found := searchCache.Get(cacheKey); found {
		c.Set("Content-Type", "application/json")
		return c.Send(cachedVal)
	}

	// Prevent duplicate concurrent requests for the same query using singleflight
	res, err, _ := sfGroup.Do(cacheKey, func() (interface{}, error) {
		// Double check cache in case it was written during lock wait
		if cachedVal, found := searchCache.Get(cacheKey); found {
			return cachedVal, nil
		}

		var queryMap map[string]interface{}
		if query == "" {
			queryMap = map[string]interface{}{
				"match_all": map[string]interface{}{},
			}
		} else {
			queryMap = map[string]interface{}{
				"bool": map[string]interface{}{
					"should": []interface{}{
						map[string]interface{}{
							"match_phrase_prefix": map[string]interface{}{
								"product_name": map[string]interface{}{
									"query": query,
									"boost": 5,
								},
							},
						},
						map[string]interface{}{
							"match": map[string]interface{}{
								"product_name": map[string]interface{}{
									"query":     query,
									"fuzziness": "AUTO",
								},
							},
						},
					},
				},
			}
		}

		// Prepare OpenSearch Query
		payload := map[string]interface{}{
			"size":  15,
			"query": queryMap,
		}

		payloadBytes, err := json.Marshal(payload)
		if err != nil {
			log.Printf("Error marshaling OpenSearch payload: %v\n", err)
			return nil, fmt.Errorf("failed to construct query")
		}

		resp, err := httpClient.Post(openSearchURL, "application/json", bytes.NewBuffer(payloadBytes))
		if err != nil {
			log.Printf("Error querying OpenSearch: %v\n", err)
			return nil, fmt.Errorf("search failed")
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			respBody, _ := io.ReadAll(resp.Body)
			log.Printf("OpenSearch returned status %d: %s\n", resp.StatusCode, string(respBody))
			return nil, fmt.Errorf("search engine returned error")
		}

		var openSearchResp OpenSearchResponse
		if err := json.NewDecoder(resp.Body).Decode(&openSearchResp); err != nil {
			log.Printf("Error decoding OpenSearch response: %v\n", err)
			return nil, fmt.Errorf("failed to parse search results")
		}

		results := make([]DrugSearchResult, 0, len(openSearchResp.Hits.Hits))
		for _, hit := range openSearchResp.Hits.Hits {
			results = append(results, DrugSearchResult{
				ID:          hit.Source.ProductID,
				Name:        hit.Source.ProductName,
				Marketer:    hit.Source.Marketer,
				Composition: hit.Source.Composition,
			})
		}

		resultBytes, err := json.Marshal(results)
		if err != nil {
			return nil, fmt.Errorf("failed to format search results")
		}

		// Cache the result
		searchCache.Set(cacheKey, resultBytes)
		return resultBytes, nil
	})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	c.Set("Content-Type", "application/json")
	return c.Send(res.([]byte))
}

// handleSaveDraft upserts a patient draft into PostgreSQL
func handleSaveDraft(c *fiber.Ctx) error {
	var req DraftRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.PatientID == "" || len(req.Data) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "patientId and data are required"})
	}

	// Upsert query
	newID := uuid.New().String()
	query := `
		INSERT INTO "Draft" ("id", "patientId", "data", "createdAt", "updatedAt")
		VALUES ($1, $2, $3, NOW(), NOW())
		ON CONFLICT ("patientId") DO UPDATE
		SET "data" = EXCLUDED.data, "updatedAt" = NOW()
		RETURNING "id", "patientId", "data", "createdAt", "updatedAt"
	`

	var draft Draft
	err := dbPool.QueryRow(context.Background(), query, newID, req.PatientID, req.Data).Scan(
		&draft.ID, &draft.PatientID, &draft.Data, &draft.CreatedAt, &draft.UpdatedAt,
	)

	if err != nil {
		log.Printf("Error upserting draft: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save draft"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"draft":   draft,
	})
}

// handleGetDraft retrieves a patient draft from PostgreSQL
func handleGetDraft(c *fiber.Ctx) error {
	patientID := c.Params("patientId")
	if patientID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "patientId is required"})
	}

	query := `
		SELECT "id", "patientId", "data", "createdAt", "updatedAt"
		FROM "Draft"
		WHERE "patientId" = $1
	`

	var draft Draft
	err := dbPool.QueryRow(context.Background(), query, patientID).Scan(
		&draft.ID, &draft.PatientID, &draft.Data, &draft.CreatedAt, &draft.UpdatedAt,
	)

	if err != nil {
		// If no row is found, return null matching original express api behavior
		if strings.Contains(err.Error(), "no rows in result set") {
			return c.JSON(nil)
		}
		log.Printf("Error fetching draft: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch draft"})
	}

	return c.JSON(draft)
}

// handleSnowstormProxy forwards terminology queries to Java Snowstorm, with local concept and FHIR query caching & coalescing
func handleSnowstormProxy(c *fiber.Ctx) error {
	path := c.Params("*")
	
	// Cache concept search and FHIR endpoints to avoid heavy query execution on static datasets
	isCacheableQuery := c.Method() == "GET" && (strings.Contains(path, "concepts") || strings.Contains(path, "fhir"))
	
	if isCacheableQuery {
		term := strings.TrimSpace(c.Query("term"))
		if term != "" && len(term) < 3 {
			// Return empty concept search response to match Snowstorm response structure but avoid 400 Bad Request or slow query execution
			return c.JSON(fiber.Map{
				"items": []interface{}{},
				"total": 0,
				"limit": 15,
			})
		}
	}
	
	cacheKey := "snomed:" + c.OriginalURL()

	if isCacheableQuery {
		if cachedVal, found := searchCache.Get(cacheKey); found {
			c.Set("Content-Type", "application/json")
			return c.Send(cachedVal)
		}

		// Prepare request parameters outside singleflight callback to avoid concurrent fiber context access
		targetURL := fmt.Sprintf("%s/%s", snowstormURL, path)
		if c.OriginalURL() != "" {
			parsedURL, err := url.Parse(c.OriginalURL())
			if err == nil && parsedURL.RawQuery != "" {
				targetURL = fmt.Sprintf("%s/%s?%s", snowstormURL, path, parsedURL.RawQuery)
			}
		}

		headers := make(http.Header)
		c.Request().Header.VisitAll(func(k, v []byte) {
			headers.Add(string(k), string(v))
		})

		method := c.Method()
		reqBody := make([]byte, len(c.Body()))
		copy(reqBody, c.Body())

		// Coalesce duplicate requests using singleflight
		res, err, _ := sfGroup.Do(cacheKey, func() (interface{}, error) {
			// Double check cache in case it was written during queue wait
			if cachedVal, found := searchCache.Get(cacheKey); found {
				return &ProxyResponse{
					Body:       cachedVal,
					StatusCode: http.StatusOK,
					Header: http.Header{
						"Content-Type": []string{"application/json"},
					},
				}, nil
			}

			req, err := http.NewRequest(method, targetURL, bytes.NewBuffer(reqBody))
			if err != nil {
				return nil, err
			}
			req.Header = headers

			resp, err := httpClient.Do(req)
			if err != nil {
				return nil, err
			}
			defer resp.Body.Close()

			bodyBytes, err := io.ReadAll(resp.Body)
			if err != nil {
				return nil, err
			}

			respHeaders := make(http.Header)
			for k, vv := range resp.Header {
				respHeaders[k] = vv
			}

			if resp.StatusCode == http.StatusOK {
				searchCache.Set(cacheKey, bodyBytes)
			}

			return &ProxyResponse{
				Body:       bodyBytes,
				StatusCode: resp.StatusCode,
				Header:     respHeaders,
			}, nil
		})

		if err != nil {
			log.Printf("Proxy request error: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to proxy request"})
		}

		proxyResp := res.(*ProxyResponse)
		for k, vv := range proxyResp.Header {
			for _, v := range vv {
				c.Set(k, v)
			}
		}
		c.Status(proxyResp.StatusCode)
		return c.Send(proxyResp.Body)
	}

	// Reconstruct destination URL for non-cacheable requests
	targetURL := fmt.Sprintf("%s/%s", snowstormURL, path)
	if c.OriginalURL() != "" {
		parsedURL, err := url.Parse(c.OriginalURL())
		if err == nil && parsedURL.RawQuery != "" {
			targetURL = fmt.Sprintf("%s/%s?%s", snowstormURL, path, parsedURL.RawQuery)
		}
	}

	// Prepare request
	req, err := http.NewRequest(c.Method(), targetURL, bytes.NewBuffer(c.Body()))
	if err != nil {
		log.Printf("Error creating proxy request: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to proxy request"})
	}

	// Forward client headers
	c.Request().Header.VisitAll(func(k, v []byte) {
		req.Header.Add(string(k), string(v))
	})

	resp, err := httpClient.Do(req)
	if err != nil {
		log.Printf("Error forwarding proxy request to Snowstorm: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Proxy server unreachable"})
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading proxy response: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to read proxy response"})
	}

	// Write response headers and body
	for k, vv := range resp.Header {
		for _, v := range vv {
			c.Set(k, v)
		}
	}
	c.Status(resp.StatusCode)
	return c.Send(bodyBytes)
}
