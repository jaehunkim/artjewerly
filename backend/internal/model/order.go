package model

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"
)

type Order struct {
	ID              string          `json:"id"`
	Email           string          `json:"email"`
	ShippingAddress json.RawMessage `json:"shipping_address"`
	Total           int             `json:"total"`
	Currency        string          `json:"currency"`
	PaymentProvider *string         `json:"payment_provider"`
	PaymentID       *string         `json:"payment_id"`
	Status          string          `json:"status"`
	Lang            string          `json:"lang"`
	CreatedAt       time.Time       `json:"created_at"`
	Items           []OrderItem     `json:"items"`
}

type OrderItem struct {
	ID        string `json:"id"`
	OrderID   string `json:"order_id"`
	ProductID string `json:"product_id"`
	Quantity  int    `json:"quantity"`
	Price     int    `json:"price"`
	TitleEn   string `json:"title_en,omitempty"`
	Currency  string `json:"currency,omitempty"`
}

type CreateOrderRequest struct {
	Email           string             `json:"email"`
	ShippingAddress json.RawMessage    `json:"shipping_address"`
	Items           []OrderItemRequest `json:"items"`
	Currency        string             `json:"currency"`
	Lang            string             `json:"lang"`
}

type OrderItemRequest struct {
	ProductID string `json:"product_id"`
	Quantity  int    `json:"quantity"`
}

var (
	ErrEmptyOrderItems   = errors.New("items must not be empty")
	ErrInvalidQuantity   = errors.New("quantity must be greater than zero")
	ErrInvalidCurrency   = errors.New("currency must be KRW or USD")
)

func (r *CreateOrderRequest) Validate() error {
	if len(r.Items) == 0 {
		return ErrEmptyOrderItems
	}
	for i, item := range r.Items {
		if item.Quantity <= 0 {
			return fmt.Errorf("item %d: %w", i, ErrInvalidQuantity)
		}
	}
	if r.Currency != "KRW" && r.Currency != "USD" {
		return ErrInvalidCurrency
	}
	return nil
}
