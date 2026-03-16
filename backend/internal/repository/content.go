package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jaehunkim/heeang-api/internal/model"
)

type ContentRepository struct {
	pool *pgxpool.Pool
}

func NewContentRepository(pool *pgxpool.Pool) *ContentRepository {
	return &ContentRepository{pool: pool}
}

func (r *ContentRepository) Get(ctx context.Context, page string) (*model.SiteContent, error) {
	var c model.SiteContent
	err := r.pool.QueryRow(ctx,
		`SELECT id, page, content_ko, content_en, updated_at FROM site_content WHERE page = $1`,
		page).Scan(&c.ID, &c.Page, &c.ContentKo, &c.ContentEn, &c.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *ContentRepository) Upsert(ctx context.Context, page string, req *model.UpdateContentRequest) (*model.SiteContent, error) {
	var c model.SiteContent
	err := r.pool.QueryRow(ctx,
		`INSERT INTO site_content (page, content_ko, content_en)
		VALUES ($1, $2, $3)
		ON CONFLICT (page) DO UPDATE SET content_ko = $2, content_en = $3, updated_at = NOW()
		RETURNING id, page, content_ko, content_en, updated_at`,
		page, req.ContentKo, req.ContentEn).Scan(
		&c.ID, &c.Page, &c.ContentKo, &c.ContentEn, &c.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &c, nil
}
