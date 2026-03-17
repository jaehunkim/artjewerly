package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/cors"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"github.com/jaehunkim/heeang-api/internal/config"
	"github.com/jaehunkim/heeang-api/internal/handler"
	"github.com/jaehunkim/heeang-api/internal/middleware"
	"github.com/jaehunkim/heeang-api/internal/repository"
	"github.com/jaehunkim/heeang-api/internal/service"
)

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

	cfg := config.Load()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	poolCfg, err := pgxpool.ParseConfig(cfg.DatabaseURL)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to parse database config")
	}
	poolCfg.MaxConns = 25
	poolCfg.MinConns = 2
	poolCfg.MaxConnLifetime = 30 * time.Minute
	poolCfg.MaxConnIdleTime = 5 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, poolCfg)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to connect to database")
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		log.Warn().Err(err).Msg("database ping failed, continuing anyway")
	}

	// Repositories
	productRepo := repository.NewProductRepository(pool)
	imageRepo := repository.NewImageRepository(pool)
	orderRepo := repository.NewOrderRepository(pool)
	contentRepo := repository.NewContentRepository(pool)

	// Services
	storageSvc := service.NewStorageService(cfg)
	imagingSvc := service.NewImagingService(storageSvc)
	productSvc := service.NewProductService(productRepo, imageRepo, storageSvc)
	orderSvc := service.NewOrderService(orderRepo)
	paymentSvc := service.NewPaymentService(cfg, orderRepo)
	contentSvc := service.NewContentService(contentRepo)

	// Handlers
	healthHandler := handler.NewHealthHandler(pool)
	productHandler := handler.NewProductHandler(productSvc)
	imageHandler := handler.NewImageHandler(imageRepo, storageSvc, imagingSvc)
	orderHandler := handler.NewOrderHandler(orderSvc)
	paymentHandler := handler.NewPaymentHandler(paymentSvc)
	contentHandler := handler.NewContentHandler(contentSvc)

	// Router
	r := chi.NewRouter()
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(chimw.RealIP)
	r.Use(chimw.Timeout(15 * time.Second))

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   cfg.AllowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})
	r.Use(corsHandler.Handler)

	// Public routes
	r.Get("/api/health", healthHandler.Check)
	r.Get("/api/products", productHandler.List)
	r.Get("/api/products/{id}", productHandler.Get)
	r.Get("/api/content/{page}", contentHandler.Get)

	// Admin routes
	adminAuth := middleware.NewAdminAuth(cfg.AdminPassword)
	rateLimiter := middleware.NewRateLimiter(5, time.Minute)

	r.Group(func(r chi.Router) {
		r.Use(rateLimiter.Limit)
		r.Use(adminAuth.Authenticate)

		r.Post("/api/products", productHandler.Create)
		r.Put("/api/products/{id}", productHandler.Update)
		r.Delete("/api/products/{id}", productHandler.Delete)

		r.Post("/api/images/presign", imageHandler.Presign)
		r.Post("/api/images", imageHandler.Create)
		r.Delete("/api/images/{id}", imageHandler.Delete)

		r.Put("/api/content/{page}", contentHandler.Update)

		r.Get("/api/orders", orderHandler.List)
		r.Put("/api/orders/{id}/status", orderHandler.UpdateStatus)
	})

	// Order routes (mixed auth)
	r.Post("/api/orders", orderHandler.Create)
	r.Get("/api/orders/{id}", orderHandler.Get)

	// Payment routes
	r.Post("/api/orders/{id}/pay/stripe", paymentHandler.CreateStripeIntent)
	r.Post("/api/orders/{id}/pay/toss", paymentHandler.CreateTossPayment)
	r.Post("/api/webhooks/stripe", paymentHandler.StripeWebhook)
	r.Post("/api/webhooks/toss", paymentHandler.TossWebhook)

	addr := fmt.Sprintf(":%s", cfg.Port)
	srv := &http.Server{
		Addr:              addr,
		Handler:           r,
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       30 * time.Second,
		WriteTimeout:      60 * time.Second,
		IdleTimeout:       120 * time.Second,
		MaxHeaderBytes:    1 << 20, // 1 MB
	}

	go func() {
		log.Info().Str("addr", addr).Msg("starting server")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal().Err(err).Msg("server error")
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info().Msg("shutting down server")
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()
	srv.Shutdown(shutdownCtx)
}
