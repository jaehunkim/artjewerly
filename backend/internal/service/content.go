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
	normalizedPage, err := model.NormalizeContentPage(page)
	if err != nil {
		return nil, err
	}

	return s.repo.Get(ctx, normalizedPage)
}

func (s *ContentService) Update(ctx context.Context, page string, req *model.UpdateContentRequest) (*model.SiteContent, error) {
	normalizedPage, err := model.NormalizeContentPage(page)
	if err != nil {
		return nil, err
	}

	if err := req.Validate(); err != nil {
		return nil, err
	}

	return s.repo.Upsert(ctx, normalizedPage, req)
}
