package service

import (
	"context"

	"github.com/jaehunkim/heeang-api/internal/model"
	"github.com/jaehunkim/heeang-api/internal/repository"
)

type OrderService struct {
	repo *repository.OrderRepository
}

func NewOrderService(repo *repository.OrderRepository) *OrderService {
	return &OrderService{repo: repo}
}

func (s *OrderService) Create(ctx context.Context, req *model.CreateOrderRequest) (*model.Order, error) {
	// TODO: calculate total from product prices
	total := 0
	return s.repo.Create(ctx, req, total)
}

func (s *OrderService) Get(ctx context.Context, id string) (*model.Order, error) {
	return s.repo.Get(ctx, id)
}

func (s *OrderService) List(ctx context.Context) ([]model.Order, error) {
	return s.repo.List(ctx)
}

func (s *OrderService) UpdateStatus(ctx context.Context, id, status string) error {
	return s.repo.UpdateStatus(ctx, id, status)
}
