package handler

import (
	"context"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jaehunkim/heeang-api/internal/model"
	"github.com/jaehunkim/heeang-api/internal/service"
)

const maxContentUpdateBodyBytes int64 = 1 << 20

type contentServicer interface {
	Get(ctx context.Context, page string) (*model.SiteContent, error)
	Update(ctx context.Context, page string, req *model.UpdateContentRequest) (*model.SiteContent, error)
}

type ContentHandler struct {
	svc contentServicer
}

func NewContentHandler(svc *service.ContentService) *ContentHandler {
	return &ContentHandler{svc: svc}
}

func (h *ContentHandler) Get(w http.ResponseWriter, r *http.Request) {
	page := chi.URLParam(r, "page")

	w.Header().Set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600")

	content, err := h.svc.Get(r.Context(), page)
	if err != nil {
		if errors.Is(err, model.ErrInvalidContentPage) {
			respondError(w, http.StatusBadRequest, err.Error())
			return
		}
		respondError(w, http.StatusNotFound, "content not found")
		return
	}
	respondJSON(w, http.StatusOK, content)
}

func (h *ContentHandler) Update(w http.ResponseWriter, r *http.Request) {
	page := chi.URLParam(r, "page")
	var req model.UpdateContentRequest
	if err := decodeJSONBody(w, r, &req, maxContentUpdateBodyBytes); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	content, err := h.svc.Update(r.Context(), page, &req)
	if err != nil {
		switch {
		case errors.Is(err, model.ErrInvalidContentPage), errors.Is(err, model.ErrEmptyContentUpdate):
			respondError(w, http.StatusBadRequest, err.Error())
		default:
			respondError(w, http.StatusInternalServerError, "failed to update content")
		}
		return
	}
	respondJSON(w, http.StatusOK, content)
}
