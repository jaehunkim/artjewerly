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

const (
	testUUID1 = "00000000-0000-0000-0000-000000000001"
	testUUID2 = "00000000-0000-0000-0000-000000000002"
	testUUID3 = "00000000-0000-0000-0000-000000000003"
)

// mockProductService implements productServicer for testing.
type mockProductService struct {
	listFn   func(ctx context.Context, category string) ([]model.Product, error)
	getFn    func(ctx context.Context, id string) (*model.Product, error)
	createFn func(ctx context.Context, req *model.CreateProductRequest) (*model.Product, error)
	updateFn func(ctx context.Context, id string, req *model.UpdateProductRequest) (*model.Product, error)
	deleteFn func(ctx context.Context, id string) error
}

func (m *mockProductService) List(ctx context.Context, category string) ([]model.Product, error) {
	return m.listFn(ctx, category)
}
func (m *mockProductService) Get(ctx context.Context, id string) (*model.Product, error) {
	return m.getFn(ctx, id)
}
func (m *mockProductService) Create(ctx context.Context, req *model.CreateProductRequest) (*model.Product, error) {
	return m.createFn(ctx, req)
}
func (m *mockProductService) Update(ctx context.Context, id string, req *model.UpdateProductRequest) (*model.Product, error) {
	return m.updateFn(ctx, id, req)
}
func (m *mockProductService) Delete(ctx context.Context, id string) error {
	return m.deleteFn(ctx, id)
}

func sampleProduct(id string) *model.Product {
	return &model.Product{
		ID:          id,
		Category:    "ring",
		TitleKo:     "반지",
		TitleEn:     "Ring",
		Currency:    "KRW",
		IsAvailable: true,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		Images:      []model.Image{},
	}
}

// withChiParam injects a chi URL parameter into the request context.
func withChiParam(r *http.Request, key, value string) *http.Request {
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add(key, value)
	return r.WithContext(context.WithValue(r.Context(), chi.RouteCtxKey, rctx))
}

func TestProductHandler_List_returns200WithProductsOnSuccess(t *testing.T) {
	products := []model.Product{*sampleProduct("abc-1"), *sampleProduct("abc-2")}
	h := &ProductHandler{svc: &mockProductService{
		listFn: func(_ context.Context, _ string) ([]model.Product, error) {
			return products, nil
		},
	}}

	req := httptest.NewRequest(http.MethodGet, "/products", nil)
	rr := httptest.NewRecorder()
	h.List(rr, req)

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

func TestProductHandler_List_filters_by_category_query_param(t *testing.T) {
	var capturedCategory string
	h := &ProductHandler{svc: &mockProductService{
		listFn: func(_ context.Context, category string) ([]model.Product, error) {
			capturedCategory = category
			return []model.Product{}, nil
		},
	}}

	req := httptest.NewRequest(http.MethodGet, "/products?category=necklace", nil)
	rr := httptest.NewRecorder()
	h.List(rr, req)

	if capturedCategory != "necklace" {
		t.Errorf("expected category necklace, got %q", capturedCategory)
	}
}

func TestProductHandler_List_returns500WhenServiceFails(t *testing.T) {
	h := &ProductHandler{svc: &mockProductService{
		listFn: func(_ context.Context, _ string) ([]model.Product, error) {
			return nil, errors.New("db error")
		},
	}}

	req := httptest.NewRequest(http.MethodGet, "/products", nil)
	rr := httptest.NewRecorder()
	h.List(rr, req)

	if rr.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", rr.Code)
	}
}

func TestProductHandler_Get_returns200WithProductOnSuccess(t *testing.T) {
	product := sampleProduct(testUUID1)
	h := &ProductHandler{svc: &mockProductService{
		getFn: func(_ context.Context, id string) (*model.Product, error) {
			return product, nil
		},
	}}

	req := httptest.NewRequest(http.MethodGet, "/products/"+testUUID1, nil)
	req = withChiParam(req, "id", testUUID1)
	rr := httptest.NewRecorder()
	h.Get(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}
}

func TestProductHandler_Get_returns404WhenProductNotFound(t *testing.T) {
	h := &ProductHandler{svc: &mockProductService{
		getFn: func(_ context.Context, id string) (*model.Product, error) {
			return nil, errors.New("not found")
		},
	}}

	req := httptest.NewRequest(http.MethodGet, "/products/"+testUUID2, nil)
	req = withChiParam(req, "id", testUUID2)
	rr := httptest.NewRecorder()
	h.Get(rr, req)

	if rr.Code != http.StatusNotFound {
		t.Errorf("expected 404, got %d", rr.Code)
	}
}

func TestProductHandler_Get_returns400WhenIDNotUUID(t *testing.T) {
	h := &ProductHandler{svc: &mockProductService{}}

	req := httptest.NewRequest(http.MethodGet, "/products/not-a-uuid", nil)
	req = withChiParam(req, "id", "not-a-uuid")
	rr := httptest.NewRecorder()
	h.Get(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", rr.Code)
	}
}

func TestProductHandler_Create_returns201WithCreatedProduct(t *testing.T) {
	created := sampleProduct("new-id")
	h := &ProductHandler{svc: &mockProductService{
		createFn: func(_ context.Context, req *model.CreateProductRequest) (*model.Product, error) {
			return created, nil
		},
	}}

	body := `{"category":"ring","title_ko":"반지","title_en":"Ring","currency":"KRW","is_available":true}`
	req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	h.Create(rr, req)

	if rr.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d", rr.Code)
	}
}

func TestProductHandler_Create_returns400OnInvalidRequestBody(t *testing.T) {
	h := &ProductHandler{svc: &mockProductService{}}

	req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewBufferString("not-json{{{"))
	rr := httptest.NewRecorder()
	h.Create(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", rr.Code)
	}
}

func TestProductHandler_Create_returns500WhenServiceFails(t *testing.T) {
	h := &ProductHandler{svc: &mockProductService{
		createFn: func(_ context.Context, req *model.CreateProductRequest) (*model.Product, error) {
			return nil, errors.New("insert failed")
		},
	}}

	body := `{"category":"ring","title_ko":"반지","title_en":"Ring","currency":"KRW"}`
	req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	h.Create(rr, req)

	if rr.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", rr.Code)
	}
}

func TestProductHandler_Update_returns200WithUpdatedProduct(t *testing.T) {
	updated := sampleProduct(testUUID1)
	h := &ProductHandler{svc: &mockProductService{
		updateFn: func(_ context.Context, id string, req *model.UpdateProductRequest) (*model.Product, error) {
			return updated, nil
		},
	}}

	titleEn := "Updated Ring"
	reqBody, _ := json.Marshal(model.UpdateProductRequest{TitleEn: &titleEn})
	req := httptest.NewRequest(http.MethodPut, "/products/"+testUUID1, bytes.NewBuffer(reqBody))
	req = withChiParam(req, "id", testUUID1)
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	h.Update(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}
}

func TestProductHandler_Update_returns400OnInvalidRequestBody(t *testing.T) {
	h := &ProductHandler{svc: &mockProductService{}}

	req := httptest.NewRequest(http.MethodPut, "/products/"+testUUID1, bytes.NewBufferString("{bad json"))
	req = withChiParam(req, "id", testUUID1)
	rr := httptest.NewRecorder()
	h.Update(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", rr.Code)
	}
}

func TestProductHandler_Update_returns500WhenServiceFails(t *testing.T) {
	h := &ProductHandler{svc: &mockProductService{
		updateFn: func(_ context.Context, id string, req *model.UpdateProductRequest) (*model.Product, error) {
			return nil, errors.New("update failed")
		},
	}}

	req := httptest.NewRequest(http.MethodPut, "/products/"+testUUID3, bytes.NewBufferString("{}"))
	req = withChiParam(req, "id", testUUID3)
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	h.Update(rr, req)

	if rr.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", rr.Code)
	}
}

func TestProductHandler_Delete_returns200WithDeletedIdOnSuccess(t *testing.T) {
	h := &ProductHandler{svc: &mockProductService{
		deleteFn: func(_ context.Context, id string) error {
			return nil
		},
	}}

	req := httptest.NewRequest(http.MethodDelete, "/products/"+testUUID1, nil)
	req = withChiParam(req, "id", testUUID1)
	rr := httptest.NewRecorder()
	h.Delete(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}
	var body map[string]interface{}
	if err := json.NewDecoder(rr.Body).Decode(&body); err != nil {
		t.Fatalf("invalid JSON: %v", err)
	}
	data, ok := body["data"].(map[string]interface{})
	if !ok {
		t.Fatalf("expected data to be an object, got %T", body["data"])
	}
	if data["deleted"] != testUUID1 {
		t.Errorf("expected deleted id %s, got %v", testUUID1, data["deleted"])
	}
}

func TestProductHandler_Delete_returns500WhenServiceFails(t *testing.T) {
	h := &ProductHandler{svc: &mockProductService{
		deleteFn: func(_ context.Context, id string) error {
			return errors.New("delete failed")
		},
	}}

	req := httptest.NewRequest(http.MethodDelete, "/products/"+testUUID3, nil)
	req = withChiParam(req, "id", testUUID3)
	rr := httptest.NewRecorder()
	h.Delete(rr, req)

	if rr.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", rr.Code)
	}
}
