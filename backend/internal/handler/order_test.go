package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/jaehunkim/heeang-api/internal/model"
	"github.com/jaehunkim/heeang-api/internal/repository"
)

type mockOrderService struct {
	createFn       func(ctx context.Context, req *model.CreateOrderRequest) (*model.Order, error)
	getFn          func(ctx context.Context, id string) (*model.Order, error)
	listFn         func(ctx context.Context) ([]model.Order, error)
	updateStatusFn func(ctx context.Context, id, status string) error
}

func (m *mockOrderService) Create(ctx context.Context, req *model.CreateOrderRequest) (*model.Order, error) {
	if m.createFn == nil {
		return nil, nil
	}
	return m.createFn(ctx, req)
}

func (m *mockOrderService) Get(ctx context.Context, id string) (*model.Order, error) {
	if m.getFn == nil {
		return nil, nil
	}
	return m.getFn(ctx, id)
}

func (m *mockOrderService) List(ctx context.Context) ([]model.Order, error) {
	if m.listFn == nil {
		return nil, nil
	}
	return m.listFn(ctx)
}

func (m *mockOrderService) UpdateStatus(ctx context.Context, id, status string) error {
	if m.updateStatusFn == nil {
		return nil
	}
	return m.updateStatusFn(ctx, id, status)
}

func decodeResponseBody(t *testing.T, body *bytes.Buffer) map[string]any {
	t.Helper()

	var payload map[string]any
	if err := json.NewDecoder(body).Decode(&payload); err != nil {
		t.Fatalf("failed to decode response body: %v", err)
	}
	return payload
}

func TestOrderHandler_GetReturns404WhenOrderNotFound(t *testing.T) {
	h := &OrderHandler{svc: &mockOrderService{
		getFn: func(_ context.Context, _ string) (*model.Order, error) {
			return nil, repository.ErrNotFound
		},
	}}

	req := httptest.NewRequest(http.MethodGet, "/orders/"+testUUID1, nil)
	req = withChiParam(req, "id", testUUID1)
	rr := httptest.NewRecorder()

	h.Get(rr, req)

	if rr.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", rr.Code)
	}

	body := decodeResponseBody(t, rr.Body)
	if body["error"] != "order not found" {
		t.Fatalf("expected not found error, got %v", body["error"])
	}
}

func TestOrderHandler_GetReturns504WhenServiceTimesOut(t *testing.T) {
	h := &OrderHandler{svc: &mockOrderService{
		getFn: func(_ context.Context, _ string) (*model.Order, error) {
			return nil, context.DeadlineExceeded
		},
	}}

	req := httptest.NewRequest(http.MethodGet, "/orders/"+testUUID1, nil)
	req = withChiParam(req, "id", testUUID1)
	rr := httptest.NewRecorder()

	h.Get(rr, req)

	if rr.Code != http.StatusGatewayTimeout {
		t.Fatalf("expected 504, got %d", rr.Code)
	}
}

func TestOrderHandler_CreateReturns500WithoutLeakingInternalError(t *testing.T) {
	h := &OrderHandler{svc: &mockOrderService{
		createFn: func(_ context.Context, _ *model.CreateOrderRequest) (*model.Order, error) {
			return nil, errors.New("sql: connection reset by peer")
		},
	}}

	req := httptest.NewRequest(http.MethodPost, "/orders", bytes.NewBufferString(`{"email":"x@example.com","items":[{"product_id":"p1","quantity":1}],"currency":"KRW"}`))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.Create(rr, req)

	if rr.Code != http.StatusInternalServerError {
		t.Fatalf("expected 500, got %d", rr.Code)
	}

	body := decodeResponseBody(t, rr.Body)
	if body["error"] != "internal server error" {
		t.Fatalf("expected sanitized error, got %v", body["error"])
	}
}

func TestOrderHandler_ListReturns504WhenServiceTimesOut(t *testing.T) {
	h := &OrderHandler{svc: &mockOrderService{
		listFn: func(_ context.Context) ([]model.Order, error) {
			return nil, context.DeadlineExceeded
		},
	}}

	req := httptest.NewRequest(http.MethodGet, "/orders", nil)
	rr := httptest.NewRecorder()

	h.List(rr, req)

	if rr.Code != http.StatusGatewayTimeout {
		t.Fatalf("expected 504, got %d", rr.Code)
	}
}

func TestOrderHandler_UpdateStatusReturns404WhenOrderMissing(t *testing.T) {
	h := &OrderHandler{svc: &mockOrderService{
		updateStatusFn: func(_ context.Context, _, _ string) error {
			return repository.ErrNotFound
		},
	}}

	req := httptest.NewRequest(http.MethodPut, "/orders/"+testUUID1+"/status", bytes.NewBufferString(`{"status":"paid"}`))
	req = withChiParam(req, "id", testUUID1)
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.UpdateStatus(rr, req)

	if rr.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", rr.Code)
	}
}
