package config

import "os"

type Config struct {
	Port            string
	DatabaseURL     string
	AdminPassword   string
	AllowedOrigins  []string
	R2AccountID     string
	R2AccessKeyID   string
	R2SecretKey     string
	R2BucketName    string
	R2PublicURL     string
	StripeSecretKey     string
	StripeWebhookSecret string
	TossSecretKey       string
}

func Load() *Config {
	return &Config{
		Port:            getEnv("PORT", "8080"),
		DatabaseURL:     getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/heeang?sslmode=disable"),
		AdminPassword:   getEnv("ADMIN_PASSWORD", "admin"),
		AllowedOrigins:  []string{getEnv("ALLOWED_ORIGIN", "http://localhost:3000")},
		R2AccountID:     getEnv("R2_ACCOUNT_ID", ""),
		R2AccessKeyID:   getEnv("R2_ACCESS_KEY_ID", ""),
		R2SecretKey:     getEnv("R2_SECRET_KEY", ""),
		R2BucketName:    getEnv("R2_BUCKET_NAME", "heeang-images"),
		R2PublicURL:     getEnv("R2_PUBLIC_URL", ""),
		StripeSecretKey:     getEnv("STRIPE_SECRET_KEY", ""),
		StripeWebhookSecret: getEnv("STRIPE_WEBHOOK_SECRET", ""),
		TossSecretKey:       getEnv("TOSS_SECRET_KEY", ""),
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
