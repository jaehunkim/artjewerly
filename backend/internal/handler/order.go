package handler

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jaehunkim/heeang-api/internal/model"
	"github.com/jaehunkim/heeang-api/internal/service"
)

type orderServicer interface {
	Create(ctx context.Context, req *model.CreateOrderRequest) (*model.Order, error)
	Get(ctx context.Context, id string) (*model.Order, error)
	List(ctx context.Context) ([]model.Order, error)
	UpdateStatus(ctx context.Context, id, status string) error
}

type OrderHandler struct {
	svc orderServicer
}

func NewOrderHandler(svc *service.OrderService) *OrderHandler {
	return &OrderHandler{svc: svc}
}

func (h *OrderHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req model.CreateOrderRequest
	if err := decodeJSONBody(w, r, &req, maxRequestBodySize); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	if err := req.Validate(); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	order, err := h.svc.Create(r.Context(), &req)
	if err != nil {
		if service.IsTimeout(err) {
			respondError(w, http.StatusGatewayTimeout, "request timed out")
			return
		}
		respondError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	respondJSON(w, http.StatusCreated, order)
}

func (h *OrderHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if !isValidUUID(id) {
		respondError(w, http.StatusBadRequest, "invalid order id")
		return
	}
	order, err := h.svc.Get(r.Context(), id)
	if err != nil {
		switch {
		case service.IsNotFound(err):
			respondError(w, http.StatusNotFound, "order not found")
		case service.IsTimeout(err):
			respondError(w, http.StatusGatewayTimeout, "request timed out")
		default:
			respondError(w, http.StatusInternalServerError, "internal server error")
		}
		return
	}
	respondJSON(w, http.StatusOK, order)
}

func (h *OrderHandler) List(w http.ResponseWriter, r *http.Request) {
	orders, err := h.svc.List(r.Context())
	if err != nil {
		if service.IsTimeout(err) {
			respondError(w, http.StatusGatewayTimeout, "request timed out")
			return
		}
		respondError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	respondJSON(w, http.StatusOK, orders)
}

func (h *OrderHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if !isValidUUID(id) {
		respondError(w, http.StatusBadRequest, "invalid order id")
		return
	}
	var body struct {
		Status string `json:"status"`
	}
	if err := decodeJSONBody(w, r, &body, maxRequestBodySize); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.svc.UpdateStatus(r.Context(), id, body.Status); err != nil {
		switch {
		case service.IsNotFound(err):
			respondError(w, http.StatusNotFound, "order not found")
		case service.IsTimeout(err):
			respondError(w, http.StatusGatewayTimeout, "request timed out")
		default:
			respondError(w, http.StatusInternalServerError, "internal server error")
		}
		return
	}
	respondJSON(w, http.StatusOK, map[string]string{"id": id, "status": body.Status})
}
