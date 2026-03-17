package model

import (
	"errors"
	"testing"
)

func TestNormalizeContentPage_normalizesValidPage(t *testing.T) {
	page, err := NormalizeContentPage(" Info-Page ")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if page != "info-page" {
		t.Fatalf("expected normalized page info-page, got %q", page)
	}
}

func TestNormalizeContentPage_rejectsInvalidPage(t *testing.T) {
	_, err := NormalizeContentPage("../../etc/passwd")
	if !errors.Is(err, ErrInvalidContentPage) {
		t.Fatalf("expected ErrInvalidContentPage, got %v", err)
	}
}

func TestUpdateContentRequest_Validate_requiresAtLeastOneField(t *testing.T) {
	req := &UpdateContentRequest{}
	if err := req.Validate(); !errors.Is(err, ErrEmptyContentUpdate) {
		t.Fatalf("expected ErrEmptyContentUpdate, got %v", err)
	}
}

func TestUpdateContentRequest_Validate_acceptsSingleFieldUpdate(t *testing.T) {
	value := "hello"
	req := &UpdateContentRequest{ContentKo: &value}
	if err := req.Validate(); err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}
