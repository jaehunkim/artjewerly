package repository

import (
	"context"
	"encoding/json"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jaehunkim/heeang-api/internal/model"
)

type ImageRepository struct {
	pool *pgxpool.Pool
}

func NewImageRepository(pool *pgxpool.Pool) *ImageRepository {
	return &ImageRepository{pool: pool}
}

func (r *ImageRepository) ListByProduct(ctx context.Context, productID string) ([]model.Image, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, product_id, r2_key, variants, alt_ko, alt_en, sort_order, created_at
		FROM images WHERE product_id = $1 ORDER BY sort_order`, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var images []model.Image
	for rows.Next() {
		var img model.Image
		err := rows.Scan(&img.ID, &img.ProductID, &img.R2Key, &img.Variants,
			&img.AltKo, &img.AltEn, &img.SortOrder, &img.CreatedAt)
		if err != nil {
			return nil, err
		}
		images = append(images, img)
	}
	return images, nil
}

func (r *ImageRepository) Get(ctx context.Context, id string) (*model.Image, error) {
	var img model.Image
	err := r.pool.QueryRow(ctx,
		`SELECT id, product_id, r2_key, variants, alt_ko, alt_en, sort_order, created_at
		FROM images WHERE id = $1`, id).Scan(
		&img.ID, &img.ProductID, &img.R2Key, &img.Variants,
		&img.AltKo, &img.AltEn, &img.SortOrder, &img.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &img, nil
}

func (r *ImageRepository) Create(ctx context.Context, req *model.CreateImageRequest, variants json.RawMessage) (*model.Image, error) {
	var img model.Image
	err := r.pool.QueryRow(ctx,
		`INSERT INTO images (product_id, r2_key, variants, alt_ko, alt_en, sort_order)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, product_id, r2_key, variants, alt_ko, alt_en, sort_order, created_at`,
		req.ProductID, req.R2Key, variants, req.AltKo, req.AltEn, req.SortOrder).Scan(
		&img.ID, &img.ProductID, &img.R2Key, &img.Variants,
		&img.AltKo, &img.AltEn, &img.SortOrder, &img.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &img, nil
}

func (r *ImageRepository) Delete(ctx context.Context, id string) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM images WHERE id = $1`, id)
	return err
}
