package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/paymentintent"
	"github.com/jaehunkim/heeang-api/internal/config"
	"github.com/jaehunkim/heeang-api/internal/repository"
)

type PaymentService struct {
	cfg       *config.Config
	orderRepo *repository.OrderRepository
}

func NewPaymentService(cfg *config.Config, orderRepo *repository.OrderRepository) *PaymentService {
	stripe.Key = cfg.StripeSecretKey
	return &PaymentService{cfg: cfg, orderRepo: orderRepo}
}

// CreateStripePaymentIntent creates a Stripe PaymentIntent for the order.
func (s *PaymentService) CreateStripePaymentIntent(ctx context.Context, orderID string) (string, error) {
	order, err := s.orderRepo.Get(ctx, orderID)
	if err != nil {
		return "", fmt.Errorf("order not found: %w", err)
	}

	if order.Status != "pending" {
		return "", fmt.Errorf("order is not pending")
	}

	currency := "krw"
	amount := int64(order.Total)
	if order.Currency == "USD" {
		currency = "usd"
	}

	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(amount),
		Currency: stripe.String(currency),
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
		Metadata: map[string]string{
			"order_id": orderID,
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		return "", fmt.Errorf("stripe error: %w", err)
	}

	return pi.ClientSecret, nil
}

// CreateTossPayment returns the payment parameters needed by the Toss frontend SDK.
func (s *PaymentService) CreateTossPayment(ctx context.Context, orderID string, successURL, failURL string) (map[string]string, error) {
	order, err := s.orderRepo.Get(ctx, orderID)
	if err != nil {
		return nil, fmt.Errorf("order not found: %w", err)
	}

	if order.Status != "pending" {
		return nil, fmt.Errorf("order is not pending")
	}

	return map[string]string{
		"orderId":    orderID,
		"orderName":  fmt.Sprintf("Heeang Jewelry Order #%s", orderID[:8]),
		"amount":     fmt.Sprintf("%d", order.Total),
		"successUrl": successURL,
		"failUrl":    failURL,
	}, nil
}

// HandleStripeWebhook updates order status after a successful Stripe payment.
func (s *PaymentService) HandleStripeWebhook(ctx context.Context, paymentIntentID string, orderID string) error {
	return s.orderRepo.UpdatePayment(ctx, orderID, "stripe", paymentIntentID, "paid")
}

// HandleTossConfirm verifies the payment with Toss confirm API, then updates order status.
func (s *PaymentService) HandleTossConfirm(ctx context.Context, orderID, paymentKey string, amount int) error {
	// Call Toss confirm API to verify the payment before marking as paid.
	confirmBody, _ := json.Marshal(map[string]interface{}{
		"paymentKey": paymentKey,
		"orderId":    orderID,
		"amount":     amount,
	})

	req, err := http.NewRequestWithContext(ctx, http.MethodPost,
		"https://api.tosspayments.com/v1/payments/confirm",
		bytes.NewReader(confirmBody))
	if err != nil {
		return fmt.Errorf("build toss confirm request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.SetBasicAuth(s.cfg.TossSecretKey, "")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("toss confirm request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 1024))
		return fmt.Errorf("toss confirm rejected (status %d): %s", resp.StatusCode, string(body))
	}

	return s.orderRepo.UpdatePayment(ctx, orderID, "toss", paymentKey, "paid")
}
