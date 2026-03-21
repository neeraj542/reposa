package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"os"
	"strings"
)

// getEncryptionKey retrieves the 32-byte AES key from the environment.
// In a real production environment, this should be fetched from a secure KMS.
func getEncryptionKey() ([]byte, error) {
	keyStr := os.Getenv("ENCRYPTION_KEY")
	if keyStr == "" {
		// Fallback for development only: DO NOT USE IN PRODUCTION
		// Ideally, the app should fail to start if the key is missing.
		keyStr = "0123456789abcdef0123456789abcdef"
	}

	key := []byte(keyStr)
	if len(key) != 32 {
		return nil, errors.New("ENCRYPTION_KEY must be exactly 32 bytes long for AES-256")
	}
	return key, nil
}

// Encrypt takes a plaintext string and encrypts it using AES-256-GCM.
// It returns a base64 encoded string containing the nonce and ciphertext.
func Encrypt(plaintext string) (string, error) {
	if plaintext == "" {
		return "", nil
	}

	key, err := getEncryptionKey()
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("could not create AES cipher: %w", err)
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("could not create GCM: %w", err)
	}

	nonce := make([]byte, aesGCM.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", fmt.Errorf("could not generate nonce: %w", err)
	}

	ciphertext := aesGCM.Seal(nonce, nonce, []byte(plaintext), nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// Decrypt takes a base64 encoded ciphertext (including nonce) and decrypts it.
func Decrypt(encryptedText string) (string, error) {
	if encryptedText == "" {
		return "", nil
	}

	// Legacy Support: GitHub tokens usually start with ghp_ or gho_.
	// If the string starts with these and isn't a long base64 string,
	// it's likely an unencrypted legacy token.
	if len(encryptedText) < 50 && (strings.HasPrefix(encryptedText, "ghp_") || strings.HasPrefix(encryptedText, "gho_")) {
		return encryptedText, nil
	}

	key, err := getEncryptionKey()
	if err != nil {
		return "", err
	}

	ciphertext, err := base64.StdEncoding.DecodeString(encryptedText)
	if err != nil {
		// Fallback for legacy tokens if they somehow bypass the prefix check
		if strings.HasPrefix(encryptedText, "ghp_") || strings.HasPrefix(encryptedText, "gho_") {
			return encryptedText, nil
		}
		return "", fmt.Errorf("failed to decode base64 ciphertext: %w", err)
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("could not create AES cipher: %w", err)
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("could not create GCM: %w", err)
	}

	nonceSize := aesGCM.NonceSize()
	if len(ciphertext) < nonceSize {
		return "", errors.New("ciphertext is too short")
	}

	nonce, actualCiphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]
	plaintext, err := aesGCM.Open(nil, nonce, actualCiphertext, nil)
	if err != nil {
		// If decryption fails but it looks like a token, return it as-is for migration
		if strings.HasPrefix(encryptedText, "ghp_") || strings.HasPrefix(encryptedText, "gho_") {
			return encryptedText, nil
		}
		return "", fmt.Errorf("failed to decrypt text: %w", err)
	}

	return string(plaintext), nil
}
