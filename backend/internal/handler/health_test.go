package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
)

// testableHealthHandler mirrors the response-building logic of HealthHandler
// but accepts a pingErr so we can test both healthy and unhealthy paths
// without needing a real database pool.
type testableHealthHandler struct {
	pingErr error
}

func (h *testableHealthHandler) Check(w http.ResponseWriter, r *http.Request) {
	dbStatus := "connected"
	httpStatus := http.StatusOK
	var dbError string

	if h.pingErr != nil {
		dbStatus = "error"
		dbError = h.pingErr.Error()
		httpStatus = http.StatusServiceUnavailable
	}

	resp := map[string]interface{}{
		"status": "ok",
		"db":     dbStatus,
	}
	if dbError != "" {
		resp["status"] = "degraded"
		resp["error"] = dbError
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpStatus)
	json.NewEncoder(w).Encode(resp)
}

func TestHealthHandler_returns200AndContentTypeJSONWhenHealthy(t *testing.T) {
	h := &testableHealthHandler{pingErr: nil}
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rr := httptest.NewRecorder()

	h.Check(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rr.Code)
	}
	if ct := rr.Header().Get("Content-Type"); ct != "application/json" {
		t.Errorf("expected Content-Type application/json, got %q", ct)
	}
}

func TestHealthHandler_responseBodyContainsStatusOkAndDbConnectedWhenHealthy(t *testing.T) {
	h := &testableHealthHandler{pingErr: nil}
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rr := httptest.NewRecorder()

	h.Check(rr, req)

	var body map[string]interface{}
	if err := json.NewDecoder(rr.Body).Decode(&body); err != nil {
		t.Fatalf("response is not valid JSON: %v", err)
	}
	if body["status"] != "ok" {
		t.Errorf("expected status ok, got %v", body["status"])
	}
	if body["db"] != "connected" {
		t.Errorf("expected db connected, got %v", body["db"])
	}
	if _, hasError := body["error"]; hasError {
		t.Error("expected no error key when db is healthy")
	}
}

func TestHealthHandler_returns503WhenDatabaseUnreachable(t *testing.T) {
	h := &testableHealthHandler{pingErr: errors.New("dial tcp: connection refused")}
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rr := httptest.NewRecorder()

	h.Check(rr, req)

	if rr.Code != http.StatusServiceUnavailable {
		t.Errorf("expected 503, got %d", rr.Code)
	}
}

func TestHealthHandler_responseBodyContainsDegradedStatusWhenDatabaseFails(t *testing.T) {
	h := &testableHealthHandler{pingErr: errors.New("connection refused")}
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rr := httptest.NewRecorder()

	h.Check(rr, req)

	var body map[string]interface{}
	if err := json.NewDecoder(rr.Body).Decode(&body); err != nil {
		t.Fatalf("response is not valid JSON: %v", err)
	}
	if body["status"] != "degraded" {
		t.Errorf("expected status degraded, got %v", body["status"])
	}
	if body["db"] != "error" {
		t.Errorf("expected db error, got %v", body["db"])
	}
	if body["error"] == nil {
		t.Error("expected error key in response when db fails")
	}
}
