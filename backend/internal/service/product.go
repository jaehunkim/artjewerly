package service

import (
	"context"

	"github.com/rs/zerolog/log"

	"github.com/jaehunkim/heeang-api/internal/model"
	"github.com/jaehunkim/heeang-api/internal/repository"
)

type ProductService struct {
	productRepo *repository.ProductRepository
	imageRepo   *repository.ImageRepository
	storageSvc  *StorageService
}

func NewProductService(productRepo *repository.ProductRepository, imageRepo *repository.ImageRepository, storageSvc *StorageService) *ProductService {
	return &ProductService{productRepo: productRepo, imageRepo: imageRepo, storageSvc: storageSvc}
}

func (s *ProductService) List(ctx context.Context, category string) ([]model.Product, error) {
	products, err := s.productRepo.List(ctx, category)
	if err != nil {
		return nil, err
	}
	if len(products) == 0 {
		return products, nil
	}

	// Batch-fetch all images in a single query instead of N+1 queries.
	productIDs := make([]string, len(products))
	for i := range products {
		productIDs[i] = products[i].ID
	}
	imagesByProduct, err := s.imageRepo.ListByProductIDs(ctx, productIDs)
	if err != nil {
		return nil, err
	}
	for i := range products {
		products[i].Images = imagesByProduct[products[i].ID]
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
	// Fetch images before deletion so we can clean up R2 objects afterward.
	images, err := s.imageRepo.ListByProduct(ctx, id)
	if err != nil {
		return err
	}

	if err := s.productRepo.Delete(ctx, id); err != nil {
		return err
	}

	// Best-effort cleanup of R2 storage objects.
	for _, img := range images {
		if err := s.storageSvc.DeleteImageAndVariants(ctx, img.R2Key, img.Variants); err != nil {
			log.Warn().Err(err).Str("product_id", id).Str("image_id", img.ID).Msg("failed to clean up R2 objects after product deletion")
		}
	}

	return nil
}
