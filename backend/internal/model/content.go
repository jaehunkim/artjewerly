package model

import "time"

type SiteContent struct {
	ID        string    `json:"id"`
	Page      string    `json:"page"`
	ContentKo *string   `json:"content_ko"`
	ContentEn *string   `json:"content_en"`
	UpdatedAt time.Time `json:"updated_at"`
}

type UpdateContentRequest struct {
	ContentKo *string `json:"content_ko"`
	ContentEn *string `json:"content_en"`
}
