package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jaehunkim/heeang-api/internal/model"
	"github.com/jaehunkim/heeang-api/internal/repository"
	"github.com/jaehunkim/heeang-api/internal/service"
)

const maxRequestBodySize = 1 << 20 // 1 MB

type ImageHandler struct {
	repo       *repository.ImageRepository
	storageSvc *service.StorageService
	imagingSvc *service.ImagingService
}

func NewImageHandler(repo *repository.ImageRepository, storageSvc *service.StorageService, imagingSvc *service.ImagingService) *ImageHandler {
	return &ImageHandler{repo: repo, storageSvc: storageSvc, imagingSvc: imagingSvc}
}

func (h *ImageHandler) Presign(w http.ResponseWriter, r *http.Request) {
	productID := r.URL.Query().Get("product_id")
	if productID == "" {
		respondError(w, http.StatusBadRequest, "product_id required")
		return
	}
	if !isValidUUID(productID) {
		respondError(w, http.StatusBadRequest, "invalid product_id")
		return
	}

	resp, err := h.storageSvc.GeneratePresignedURL(r.Context(), productID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, resp)
}

func (h *ImageHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.CreateImageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	// Generate image variants
	variants, err := h.imagingSvc.GenerateVariants(r.Context(), req.R2Key, req.ProductID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to generate image variants: "+err.Error())
		return
	}

	image, err := h.repo.Create(r.Context(), &req, variants.ToJSON())
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusCreated, image)
}

func (h *ImageHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if !isValidUUID(id) {
		respondError(w, http.StatusBadRequest, "invalid image id")
		return
	}

	image, err := h.repo.Get(r.Context(), id)
	if err != nil {
		respondError(w, http.StatusNotFound, "image not found")
		return
	}

	// Delete all variants and original from R2
	if err := h.storageSvc.DeleteImageAndVariants(r.Context(), image.R2Key, image.Variants); err != nil {
		respondError(w, http.StatusInternalServerError, "failed to delete from storage: "+err.Error())
		return
	}

	if err := h.repo.Delete(r.Context(), id); err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, map[string]string{"deleted": id})
}
