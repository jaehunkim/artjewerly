package model

import (
	"encoding/json"
	"time"
)

type Image struct {
	ID        string          `json:"id"`
	ProductID string          `json:"product_id"`
	R2Key     string          `json:"r2_key"`
	Variants  json.RawMessage `json:"variants"`
	AltKo     *string         `json:"alt_ko"`
	AltEn     *string         `json:"alt_en"`
	SortOrder int             `json:"sort_order"`
	CreatedAt time.Time       `json:"created_at"`
}

type CreateImageRequest struct {
	ProductID string  `json:"product_id"`
	R2Key     string  `json:"r2_key"`
	AltKo     *string `json:"alt_ko"`
	AltEn     *string `json:"alt_en"`
	SortOrder int     `json:"sort_order"`
}

type PresignResponse struct {
	UploadURL string `json:"upload_url"`
	R2Key     string `json:"r2_key"`
}
