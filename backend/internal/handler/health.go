package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type HealthHandler struct {
	pool *pgxpool.Pool
}

func NewHealthHandler(pool *pgxpool.Pool) *HealthHandler {
	return &HealthHandler{pool: pool}
}

func (h *HealthHandler) Check(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()

	dbStatus := "connected"
	httpStatus := http.StatusOK
	var dbError string

	if err := h.pool.Ping(ctx); err != nil {
		dbStatus = "error"
		dbError = err.Error()
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
