package handler

import (
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/webhook"
	"github.com/jaehunkim/heeang-api/internal/service"
)

type PaymentHandler struct {
	svc *service.PaymentService
}

func NewPaymentHandler(svc *service.PaymentService) *PaymentHandler {
	return &PaymentHandler{svc: svc}
}

func (h *PaymentHandler) CreateStripeIntent(w http.ResponseWriter, r *http.Request) {
	orderID := chi.URLParam(r, "id")

	clientSecret, err := h.svc.CreateStripePaymentIntent(r.Context(), orderID)
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{
		"client_secret": clientSecret,
	})
}

func (h *PaymentHandler) CreateTossPayment(w http.ResponseWriter, r *http.Request) {
	orderID := chi.URLParam(r, "id")

	var body struct {
		SuccessURL string `json:"success_url"`
		FailURL    string `json:"fail_url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request")
		return
	}

	result, err := h.svc.CreateTossPayment(r.Context(), orderID, body.SuccessURL, body.FailURL)
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, result)
}

func (h *PaymentHandler) StripeWebhook(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "read error", http.StatusBadRequest)
		return
	}

	endpointSecret := os.Getenv("STRIPE_WEBHOOK_SECRET")
	event, err := webhook.ConstructEvent(body, r.Header.Get("Stripe-Signature"), endpointSecret)
	if err != nil {
		http.Error(w, "invalid signature", http.StatusBadRequest)
		return
	}

	if event.Type == "payment_intent.succeeded" {
		var pi stripe.PaymentIntent
		if err := json.Unmarshal(event.Data.Raw, &pi); err == nil {
			orderID := pi.Metadata["order_id"]
			if orderID != "" {
				h.svc.HandleStripeWebhook(r.Context(), pi.ID, orderID)
			}
		}
	}

	w.WriteHeader(http.StatusOK)
}

func (h *PaymentHandler) TossWebhook(w http.ResponseWriter, r *http.Request) {
	var body struct {
		OrderID    string `json:"orderId"`
		PaymentKey string `json:"paymentKey"`
		Amount     int    `json:"amount"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request")
		return
	}

	if err := h.svc.HandleTossConfirm(r.Context(), body.OrderID, body.PaymentKey); err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}
