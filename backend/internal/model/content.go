package model

import (
	"errors"
	"strings"
	"time"
)

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

var (
	ErrInvalidContentPage = errors.New("invalid content page")
	ErrEmptyContentUpdate = errors.New("at least one content field is required")
)

func NormalizeContentPage(page string) (string, error) {
	normalized := strings.ToLower(strings.TrimSpace(page))
	if normalized == "" || len(normalized) > 50 {
		return "", ErrInvalidContentPage
	}

	for _, r := range normalized {
		if (r < 'a' || r > 'z') && (r < '0' || r > '9') && r != '-' {
			return "", ErrInvalidContentPage
		}
	}

	return normalized, nil
}

func (r *UpdateContentRequest) Validate() error {
	if r == nil || (r.ContentKo == nil && r.ContentEn == nil) {
		return ErrEmptyContentUpdate
	}

	return nil
}
