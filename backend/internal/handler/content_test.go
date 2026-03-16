package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jaehunkim/heeang-api/internal/model"
)

// mockContentService implements contentServicer for testing.
type mockContentService struct {
	getFn    func(ctx context.Context, page string) (*model.SiteContent, error)
	updateFn func(ctx context.Context, page string, req *model.UpdateContentRequest) (*model.SiteContent, error)
}

func (m *mockContentService) Get(ctx context.Context, page string) (*model.SiteContent, error) {
	return m.getFn(ctx, page)
}
func (m *mockContentService) Update(ctx context.Context, page string, req *model.UpdateContentRequest) (*model.SiteContent, error) {
	return m.updateFn(ctx, page, req)
}

func sampleContent(page string) *model.SiteContent {
	ko := "내용"
	en := "Content"
	return &model.SiteContent{
		ID:        "content-id-1",
		Page:      page,
		ContentKo: &ko,
		ContentEn: &en,
		UpdatedAt: time.Now(),
	}
}

func withChiPageParam(r *http.Request, page string) *http.Request {
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("page", page)
	return r.WithContext(context.WithValue(r.Context(), chi.RouteCtxKey, rctx))
}

func TestContentHandler_Get_returns200WithContentOnSuccess(t *testing.T) {
	content := sampleContent("home")
	h := &ContentHandler{svc: &mockContentService{
		getFn: func(_ context.Context, page string) (*model.SiteContent, error) {
			return content, nil
		},
	}}

	req := httptest.NewRequest(http.MethodGet, "/content/home", nil)
	req = withChiPageParam(req, "home")
	rr := httptest.NewRecorder()
	h.Get(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}
	var body map[string]interface{}
	if err := json.NewDecoder(rr.Body).Decode(&body); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}
	if body["error"] != nil {
		t.Errorf("expected no error, got %v", body["error"])
	}
}

func TestContentHandler_Get_returns404WhenContentNotFound(t *testing.T) {
	h := &ContentHandler{svc: &mockContentService{
		getFn: func(_ context.Context, page string) (*model.SiteContent, error) {
			return nil, errors.New("not found")
		},
	}}

	req := httptest.NewRequest(http.MethodGet, "/content/missing", nil)
	req = withChiPageParam(req, "missing")
	rr := httptest.NewRecorder()
	h.Get(rr, req)

	if rr.Code != http.StatusNotFound {
		t.Errorf("expected 404, got %d", rr.Code)
	}
}

func TestContentHandler_Get_setsPageParamFromURLWhenCallingService(t *testing.T) {
	var capturedPage string
	h := &ContentHandler{svc: &mockContentService{
		getFn: func(_ context.Context, page string) (*model.SiteContent, error) {
			capturedPage = page
			return sampleContent(page), nil
		},
	}}

	req := httptest.NewRequest(http.MethodGet, "/content/about", nil)
	req = withChiPageParam(req, "about")
	rr := httptest.NewRecorder()
	h.Get(rr, req)

	if capturedPage != "about" {
		t.Errorf("expected page about, got %q", capturedPage)
	}
}

func TestContentHandler_Update_returns200WithUpdatedContentOnSuccess(t *testing.T) {
	updated := sampleContent("home")
	h := &ContentHandler{svc: &mockContentService{
		updateFn: func(_ context.Context, page string, req *model.UpdateContentRequest) (*model.SiteContent, error) {
			return updated, nil
		},
	}}

	ko := "새 내용"
	reqBody, _ := json.Marshal(model.UpdateContentRequest{ContentKo: &ko})
	req := httptest.NewRequest(http.MethodPut, "/content/home", bytes.NewBuffer(reqBody))
	req = withChiPageParam(req, "home")
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	h.Update(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}
}

func TestContentHandler_Update_returns400OnInvalidRequestBody(t *testing.T) {
	h := &ContentHandler{svc: &mockContentService{}}

	req := httptest.NewRequest(http.MethodPut, "/content/home", bytes.NewBufferString("{bad json"))
	req = withChiPageParam(req, "home")
	rr := httptest.NewRecorder()
	h.Update(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", rr.Code)
	}
}

func TestContentHandler_Update_returns500WhenServiceFails(t *testing.T) {
	h := &ContentHandler{svc: &mockContentService{
		updateFn: func(_ context.Context, page string, req *model.UpdateContentRequest) (*model.SiteContent, error) {
			return nil, errors.New("upsert failed")
		},
	}}

	req := httptest.NewRequest(http.MethodPut, "/content/home", bytes.NewBufferString("{}"))
	req = withChiPageParam(req, "home")
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	h.Update(rr, req)

	if rr.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", rr.Code)
	}
}
