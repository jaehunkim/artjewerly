package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestRateLimiter_allowsRequestsUpToMaxAttempts(t *testing.T) {
	rl := NewRateLimiter(3, time.Minute)
	handler := rl.Limit(okHandler())

	for i := 0; i < 3; i++ {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.RemoteAddr = "1.2.3.4:1234"
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
		if rr.Code != http.StatusOK {
			t.Errorf("request %d: expected 200, got %d", i+1, rr.Code)
		}
	}
}

func TestRateLimiter_blocksRequestAfterMaxAttemptsExceeded(t *testing.T) {
	rl := NewRateLimiter(3, time.Minute)
	handler := rl.Limit(okHandler())

	for i := 0; i < 3; i++ {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.RemoteAddr = "1.2.3.4:5678"
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
	}

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.RemoteAddr = "1.2.3.4:5678"
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusTooManyRequests {
		t.Errorf("expected 429, got %d", rr.Code)
	}
}

func TestRateLimiter_tracksIpAddressesSeparately(t *testing.T) {
	rl := NewRateLimiter(2, time.Minute)
	handler := rl.Limit(okHandler())

	// Exhaust limit for first IP
	for i := 0; i < 2; i++ {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.RemoteAddr = "10.0.0.1:1000"
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
	}

	// Different IP should still be allowed
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.RemoteAddr = "10.0.0.2:1000"
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected 200 for different IP, got %d", rr.Code)
	}
}

func TestRateLimiter_allowsRequestsAgainAfterWindowExpires(t *testing.T) {
	// Use a very short window so we can expire it in the test.
	rl := NewRateLimiter(2, 50*time.Millisecond)
	handler := rl.Limit(okHandler())

	// Exhaust limit
	for i := 0; i < 2; i++ {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.RemoteAddr = "9.9.9.9:9999"
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
	}

	// Should be blocked now
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.RemoteAddr = "9.9.9.9:9999"
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429 before window reset, got %d", rr.Code)
	}

	// Wait for window to expire
	time.Sleep(60 * time.Millisecond)

	req2 := httptest.NewRequest(http.MethodGet, "/", nil)
	req2.RemoteAddr = "9.9.9.9:9999"
	rr2 := httptest.NewRecorder()
	handler.ServeHTTP(rr2, req2)

	if rr2.Code != http.StatusOK {
		t.Errorf("expected 200 after window reset, got %d", rr2.Code)
	}
}
