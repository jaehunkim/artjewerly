package handler

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/rs/zerolog/log"

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
	if err := decodeJSONBody(w, r, &req, maxRequestBodySize); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Generate image variants
	variants, err := h.imagingSvc.GenerateVariants(r.Context(), req.R2Key)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to generate image variants: "+err.Error())
		return
	}

	variantsJSON := variants.ToJSON()
	image, err := h.repo.Create(r.Context(), &req, variantsJSON)
	if err != nil {
		// Best-effort cleanup of uploaded variants on DB insert failure.
		if cleanupErr := h.storageSvc.DeleteImageAndVariants(r.Context(), req.R2Key, variantsJSON); cleanupErr != nil {
			log.Warn().Err(cleanupErr).Str("r2_key", req.R2Key).Msg("failed to clean up uploaded variants after DB insert failure")
		}
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
