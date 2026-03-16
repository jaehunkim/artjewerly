package service

import (
	"context"

	"github.com/jaehunkim/heeang-api/internal/model"
	"github.com/jaehunkim/heeang-api/internal/repository"
)

type ContentService struct {
	repo *repository.ContentRepository
}

func NewContentService(repo *repository.ContentRepository) *ContentService {
	return &ContentService{repo: repo}
}

func (s *ContentService) Get(ctx context.Context, page string) (*model.SiteContent, error) {
	return s.repo.Get(ctx, page)
}

func (s *ContentService) Update(ctx context.Context, page string, req *model.UpdateContentRequest) (*model.SiteContent, error) {
	return s.repo.Upsert(ctx, page, req)
}
