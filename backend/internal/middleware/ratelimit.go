package middleware

import (
	"net/http"
	"sync"
	"time"
)

type RateLimiter struct {
	maxAttempts int
	window      time.Duration
	attempts    map[string][]time.Time
	mu          sync.Mutex
}

func NewRateLimiter(maxAttempts int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		maxAttempts: maxAttempts,
		window:      window,
		attempts:    make(map[string][]time.Time),
	}
}

func (rl *RateLimiter) Limit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr

		rl.mu.Lock()
		now := time.Now()
		cutoff := now.Add(-rl.window)

		// Clean old entries
		var valid []time.Time
		for _, t := range rl.attempts[ip] {
			if t.After(cutoff) {
				valid = append(valid, t)
			}
		}
		rl.attempts[ip] = valid

		if len(valid) >= rl.maxAttempts {
			rl.mu.Unlock()
			http.Error(w, "too many requests", http.StatusTooManyRequests)
			return
		}

		rl.attempts[ip] = append(rl.attempts[ip], now)
		rl.mu.Unlock()

		next.ServeHTTP(w, r)
	})
}
