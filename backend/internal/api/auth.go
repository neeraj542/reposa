package api

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/go-github/v58/github"
	"github.com/neeraj542/reposa/internal/models"
	"github.com/neeraj542/reposa/internal/storage"
	"golang.org/x/oauth2"
	githuboauth "golang.org/x/oauth2/github"
)

var (
	githubOAuthConfig *oauth2.Config
	jwtSecret         []byte
)

func initAuthConfig() {
	githubOAuthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		Endpoint:     githuboauth.Endpoint,
		RedirectURL:  os.Getenv("GITHUB_REDIRECT_URL"),
		Scopes:       []string{"read:user", "user:email"},
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Println("Warning: JWT_SECRET not set. Authentication will be insecure.")
		// Fallback for dev if needed, or keep empty
	}
	jwtSecret = []byte(secret)
}

// AuthHandler handles authentication requests
type AuthHandler struct {
	storage *storage.Storage
}

// NewAuthHandler creates a new AuthHandler
func NewAuthHandler(s *storage.Storage) *AuthHandler {
	initAuthConfig()
	return &AuthHandler{storage: s}
}

// GithubLogin redirects the user to GitHub for login
func (h *AuthHandler) GithubLogin(c *fiber.Ctx) error {
	// CSRF Protection: Generate and store secure random state
	b := make([]byte, 32)
	rand.Read(b)
	state := base64.StdEncoding.EncodeToString(b)

	isProd := os.Getenv("NODE_ENV") == "production"
	sameSite := "Lax"
	if isProd {
		sameSite = "None"
	}

	c.Cookie(&fiber.Cookie{
		Name:     "github_state",
		Value:    state,
		Expires:  time.Now().Add(15 * time.Minute),
		HTTPOnly: true,
		Secure:   isProd,
		SameSite: sameSite,
		Path:     "/",
	})

	url := githubOAuthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
	return c.Redirect(url)
}

// GithubCallback handles the GitHub OAuth callback
func (h *AuthHandler) GithubCallback(c *fiber.Ctx) error {
	// CSRF Verification
	state := c.Query("state")
	stateCookie := c.Cookies("github_state")
	if state == "" || state != stateCookie {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid state token"})
	}
	c.ClearCookie("github_state")

	code := c.Query("code")
	if code == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing code from GitHub"})
	}

	token, err := githubOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to exchange token"})
	}

	// Fetch GitHub user info
	client := github.NewClient(githubOAuthConfig.Client(context.Background(), token))
	ghUser, _, err := client.Users.Get(context.Background(), "")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch user info from GitHub"})
	}

	email := ghUser.GetEmail()
	if email == "" {
		// Fetch emails if not public
		emails, _, err := client.Users.ListEmails(context.Background(), nil)
		if err == nil {
			for _, e := range emails {
				if e.GetPrimary() && e.GetVerified() {
					email = e.GetEmail()
					break
				}
			}
		}
	}

	user := &models.User{
		GitHubID:    ghUser.GetID(),
		Username:    ghUser.GetLogin(),
		Email:       email,
		AvatarURL:   ghUser.GetAvatarURL(),
		GitHubToken: token.AccessToken,
		LastLogin:   time.Now(),
	}

	err = h.storage.CreateOrUpdateUser(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Failed to save user in database",
			"details": err.Error(),
		})
	}

	// Fetch the full user from DB to get the ID
	var dbUser models.User
	h.storage.DB.Where("github_id = ?", user.GitHubID).First(&dbUser)

	// Create JWT token
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": dbUser.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	t, err := jwtToken.SignedString(jwtSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create session"})
	}

	// Clear old session cookie if it exists (migration from old cookie name)
	c.ClearCookie("session")

	isProd := os.Getenv("NODE_ENV") == "production"
	sameSite := "Lax"
	if isProd {
		sameSite = "None"
	}

	// Set session cookie
	c.Cookie(&fiber.Cookie{
		Name:     "reposa_session",
		Value:    t,
		Expires:  time.Now().Add(time.Hour * 72),
		HTTPOnly: true,
		Secure:   isProd,
		SameSite: sameSite,
		Path:     "/",
	})

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173" // Safe dev fallback
		log.Println("Warning: FRONTEND_URL not set, defaulting to http://localhost:5173")
	}

	log.Printf("GithubCallback success: Redirecting user to %s", frontendURL)
	return c.Redirect(frontendURL)
}

// Logout clears the session cookie
func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	c.ClearCookie("reposa_session")
	return c.JSON(fiber.Map{"message": "Logged out successfully"})
}

// GetMe returns the current authenticated user
func (h *AuthHandler) GetMe(c *fiber.Ctx) error {
	userIDVal := c.Locals("user_id")
	if userIDVal == nil {
		// Add logging for debugging
		log.Println("GetMe: No user_id in locals")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Not logged in"})
	}

	userID := userIDVal.(uint)
	user, err := h.storage.GetUserByID(userID)
	if err != nil {
		log.Printf("GetMe: User ID %d not found in DB: %v", userID, err)
		// Explicitly clear the invalid session cookie with matching attributes
		isProd := os.Getenv("NODE_ENV") == "production"
		sameSite := "Lax"
		if isProd {
			sameSite = "None"
		}

		c.Cookie(&fiber.Cookie{
			Name:     "reposa_session",
			Value:    "",
			Expires:  time.Now().Add(-time.Hour), // Expire immediately
			MaxAge:   -1,
			HTTPOnly: true,
			Secure:   isProd,
			SameSite: sameSite,
			Path:     "/",
		})
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}
	log.Printf("GetMe success: Found user %s (ID: %d)", user.Username, user.ID)
	log.Printf("GetMe: About to return user JSON. User data: %+v", user)
	err = c.Status(fiber.StatusOK).JSON(user)
	log.Printf("GetMe: JSON response sent. Error: %v", err)
	return err
}

// GetSessionUser attempts to parse the session and set user_id in context
func GetSessionUser(c *fiber.Ctx) error {
	// Log all cookies for debugging
	log.Printf("GetSessionUser: Raw Cookie Header: %s", c.Get("Cookie"))

	cookie := c.Cookies("reposa_session")
	if cookie == "" {
		log.Println("GetSessionUser: 'reposa_session' NOT found in cookies")
		return nil
	}

	token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		log.Printf("GetSessionUser: JWT parse error: %v", err)
	}

	if err == nil && token.Valid {
		claims := token.Claims.(jwt.MapClaims)
		if userID, ok := claims["user_id"].(float64); ok {
			c.Locals("user_id", uint(userID))
		} else {
			log.Printf("GetSessionUser: Invalid user_id in claims")
		}
	} else {
		log.Printf("GetSessionUser: Token invalid. Err: %v", err)
	}

	return nil
}

// Protected middleware ensures the user is authenticated
func Protected(c *fiber.Ctx) error {
	if err := GetSessionUser(c); err != nil {
		return err
	}

	if c.Locals("user_id") == nil {
		// log.Println("Protected: User unauthorized")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	return c.Next()
}

// OptionalProtected middleware that sets user_id if authenticated, but allows unauthenticated requests
func OptionalProtected(c *fiber.Ctx) error {
	// Try to get session user (sets user_id in locals if authenticated)
	GetSessionUser(c)
	// Always continue to the handler, whether authenticated or not
	return c.Next()
}
