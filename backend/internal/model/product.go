package model

import (
	"encoding/json"
	"time"
)

type Product struct {
	ID            string    `json:"id"`
	Category      string    `json:"category"`
	TitleKo       string    `json:"title_ko"`
	TitleEn       string    `json:"title_en"`
	DescriptionKo *string   `json:"description_ko"`
	DescriptionEn *string   `json:"description_en"`
	Price         *int      `json:"price"`
	PriceUSD      *int      `json:"price_usd"`
	Currency      string    `json:"currency"`
	IsAvailable   bool      `json:"is_available"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	Images        []Image   `json:"images"`
}

type CreateProductRequest struct {
	Category      string  `json:"category"`
	TitleKo       string  `json:"title_ko"`
	TitleEn       string  `json:"title_en"`
	DescriptionKo *string `json:"description_ko"`
	DescriptionEn *string `json:"description_en"`
	Price         *int    `json:"price"`
	PriceUSD      *int    `json:"price_usd"`
	Currency      string  `json:"currency"`
	IsAvailable   bool    `json:"is_available"`
}

type UpdateProductRequest struct {
	TitleKo       *string `json:"title_ko"`
	TitleEn       *string `json:"title_en"`
	DescriptionKo *string `json:"description_ko"`
	DescriptionEn *string `json:"description_en"`
	Price         *int    `json:"price"`
	PriceUSD      *int    `json:"price_usd"`
	Currency      *string `json:"currency"`
	IsAvailable   *bool   `json:"is_available"`
}

type ImageVariants struct {
	Thumbnail string `json:"thumbnail"`
	Medium    string `json:"medium"`
	Large     string `json:"large"`
	Blur      string `json:"blur"`
}

func (v ImageVariants) ToJSON() json.RawMessage {
	b, _ := json.Marshal(v)
	return b
}
