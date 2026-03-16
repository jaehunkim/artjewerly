package service

import (
	"context"

	"github.com/jaehunkim/heeang-api/internal/model"
	"github.com/jaehunkim/heeang-api/internal/repository"
)

type ProductService struct {
	productRepo *repository.ProductRepository
	imageRepo   *repository.ImageRepository
}

func NewProductService(productRepo *repository.ProductRepository, imageRepo *repository.ImageRepository) *ProductService {
	return &ProductService{productRepo: productRepo, imageRepo: imageRepo}
}

func (s *ProductService) List(ctx context.Context, category string) ([]model.Product, error) {
	products, err := s.productRepo.List(ctx, category)
	if err != nil {
		return nil, err
	}
	for i := range products {
		images, err := s.imageRepo.ListByProduct(ctx, products[i].ID)
		if err != nil {
			return nil, err
		}
		products[i].Images = images
	}
	return products, nil
}

func (s *ProductService) Get(ctx context.Context, id string) (*model.Product, error) {
	product, err := s.productRepo.Get(ctx, id)
	if err != nil {
		return nil, err
	}
	images, err := s.imageRepo.ListByProduct(ctx, id)
	if err != nil {
		return nil, err
	}
	product.Images = images
	return product, nil
}

func (s *ProductService) Create(ctx context.Context, req *model.CreateProductRequest) (*model.Product, error) {
	return s.productRepo.Create(ctx, req)
}

func (s *ProductService) Update(ctx context.Context, id string, req *model.UpdateProductRequest) (*model.Product, error) {
	return s.productRepo.Update(ctx, id, req)
}

func (s *ProductService) Delete(ctx context.Context, id string) error {
	return s.productRepo.Delete(ctx, id)
}
