package model

import (
	"encoding/json"
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
