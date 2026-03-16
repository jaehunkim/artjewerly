package model

import (
	"encoding/json"
	"testing"
)

func TestImageVariants_ToJSON_containsAllFields(t *testing.T) {
	v := ImageVariants{
		Thumbnail: "https://cdn.example.com/thumb.jpg",
		Medium:    "https://cdn.example.com/medium.jpg",
		Large:     "https://cdn.example.com/large.jpg",
		Blur:      "https://cdn.example.com/blur.jpg",
	}

	raw := v.ToJSON()

	var got map[string]string
	if err := json.Unmarshal(raw, &got); err != nil {
		t.Fatalf("ToJSON returned invalid JSON: %v", err)
	}

	fields := map[string]string{
		"thumbnail": v.Thumbnail,
		"medium":    v.Medium,
		"large":     v.Large,
		"blur":      v.Blur,
	}
	for key, want := range fields {
		if got[key] != want {
			t.Errorf("field %q: got %q, want %q", key, got[key], want)
		}
	}
}

func TestImageVariants_ToJSON_emptyVariantsProducesValidJSON(t *testing.T) {
	v := ImageVariants{}

	raw := v.ToJSON()

	var got map[string]string
	if err := json.Unmarshal(raw, &got); err != nil {
		t.Fatalf("ToJSON with zero value returned invalid JSON: %v", err)
	}
}

func TestImageVariants_ToJSON_returnsRawMessage(t *testing.T) {
	v := ImageVariants{Thumbnail: "t", Medium: "m", Large: "l", Blur: "b"}

	raw := v.ToJSON()

	if len(raw) == 0 {
		t.Fatal("ToJSON returned empty RawMessage")
	}
	// Must be valid JSON that json package accepts directly
	if !json.Valid(raw) {
		t.Errorf("ToJSON result is not valid JSON: %s", string(raw))
	}
}
