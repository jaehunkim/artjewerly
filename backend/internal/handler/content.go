package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jaehunkim/heeang-api/internal/model"
	"github.com/jaehunkim/heeang-api/internal/service"
)

type ContentHandler struct {
	svc *service.ContentService
}

func NewContentHandler(svc *service.ContentService) *ContentHandler {
	return &ContentHandler{svc: svc}
}

func (h *ContentHandler) Get(w http.ResponseWriter, r *http.Request) {
	page := chi.URLParam(r, "page")

	w.Header().Set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600")

	content, err := h.svc.Get(r.Context(), page)
	if err != nil {
		respondError(w, http.StatusNotFound, "content not found")
		return
	}
	respondJSON(w, http.StatusOK, content)
}

func (h *ContentHandler) Update(w http.ResponseWriter, r *http.Request) {
	page := chi.URLParam(r, "page")
	var req model.UpdateContentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	content, err := h.svc.Update(r.Context(), page, &req)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, content)
}
