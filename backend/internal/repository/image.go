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

// ListByProductIDs fetches images for multiple products in a single query,
// returning them grouped by product ID. This avoids the N+1 query problem.
func (r *ImageRepository) ListByProductIDs(ctx context.Context, productIDs []string) (map[string][]model.Image, error) {
	if len(productIDs) == 0 {
		return make(map[string][]model.Image), nil
	}

	rows, err := r.pool.Query(ctx,
		`SELECT id, product_id, r2_key, variants, alt_ko, alt_en, sort_order, created_at
		FROM images WHERE product_id = ANY($1) ORDER BY sort_order`, productIDs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make(map[string][]model.Image, len(productIDs))
	for rows.Next() {
		var img model.Image
		err := rows.Scan(&img.ID, &img.ProductID, &img.R2Key, &img.Variants,
			&img.AltKo, &img.AltEn, &img.SortOrder, &img.CreatedAt)
		if err != nil {
			return nil, err
		}
		result[img.ProductID] = append(result[img.ProductID], img)
	}
	return result, nil
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
