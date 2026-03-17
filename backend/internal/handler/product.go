package handler

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jaehunkim/heeang-api/internal/model"
	"github.com/jaehunkim/heeang-api/internal/service"
)

type productServicer interface {
	List(ctx context.Context, category string) ([]model.Product, error)
	Get(ctx context.Context, id string) (*model.Product, error)
	Create(ctx context.Context, req *model.CreateProductRequest) (*model.Product, error)
	Update(ctx context.Context, id string, req *model.UpdateProductRequest) (*model.Product, error)
	Delete(ctx context.Context, id string) error
}

type ProductHandler struct {
	svc productServicer
}

func NewProductHandler(svc *service.ProductService) *ProductHandler {
	return &ProductHandler{svc: svc}
}

func (h *ProductHandler) List(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")

	w.Header().Set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600")

	products, err := h.svc.List(r.Context(), category)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, products)
}

func (h *ProductHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if !isValidUUID(id) {
		respondError(w, http.StatusBadRequest, "invalid product id")
		return
	}

	w.Header().Set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600")

	product, err := h.svc.Get(r.Context(), id)
	if err != nil {
		respondError(w, http.StatusNotFound, "product not found")
		return
	}
	respondJSON(w, http.StatusOK, product)
}

func (h *ProductHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.CreateProductRequest
	if err := decodeJSONBody(w, r, &req, maxRequestBodySize); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	product, err := h.svc.Create(r.Context(), &req)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusCreated, product)
}

func (h *ProductHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if !isValidUUID(id) {
		respondError(w, http.StatusBadRequest, "invalid product id")
		return
	}
	var req model.UpdateProductRequest
	if err := decodeJSONBody(w, r, &req, maxRequestBodySize); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	product, err := h.svc.Update(r.Context(), id, &req)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, product)
}

func (h *ProductHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if !isValidUUID(id) {
		respondError(w, http.StatusBadRequest, "invalid product id")
		return
	}
	if err := h.svc.Delete(r.Context(), id); err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, map[string]string{"deleted": id})
}
