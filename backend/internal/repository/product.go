package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jaehunkim/heeang-api/internal/model"
)

type ProductRepository struct {
	pool *pgxpool.Pool
}

func NewProductRepository(pool *pgxpool.Pool) *ProductRepository {
	return &ProductRepository{pool: pool}
}

func (r *ProductRepository) List(ctx context.Context, category string) ([]model.Product, error) {
	query := `SELECT id, category, title_ko, title_en, description_ko, description_en,
		price, price_usd, currency, is_available, created_at, updated_at
		FROM products WHERE ($1 = '' OR category = $1) ORDER BY created_at DESC`

	rows, err := r.pool.Query(ctx, query, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []model.Product
	for rows.Next() {
		var p model.Product
		err := rows.Scan(&p.ID, &p.Category, &p.TitleKo, &p.TitleEn,
			&p.DescriptionKo, &p.DescriptionEn, &p.Price, &p.PriceUSD,
			&p.Currency, &p.IsAvailable, &p.CreatedAt, &p.UpdatedAt)
		if err != nil {
			return nil, err
		}
		products = append(products, p)
	}
	return products, nil
}

func (r *ProductRepository) Get(ctx context.Context, id string) (*model.Product, error) {
	var p model.Product
	err := r.pool.QueryRow(ctx,
		`SELECT id, category, title_ko, title_en, description_ko, description_en,
			price, price_usd, currency, is_available, created_at, updated_at
			FROM products WHERE id = $1`, id).Scan(
		&p.ID, &p.Category, &p.TitleKo, &p.TitleEn,
		&p.DescriptionKo, &p.DescriptionEn, &p.Price, &p.PriceUSD,
		&p.Currency, &p.IsAvailable, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *ProductRepository) Create(ctx context.Context, req *model.CreateProductRequest) (*model.Product, error) {
	var p model.Product
	err := r.pool.QueryRow(ctx,
		`INSERT INTO products (category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available, created_at, updated_at`,
		req.Category, req.TitleKo, req.TitleEn, req.DescriptionKo, req.DescriptionEn,
		req.Price, req.PriceUSD, req.Currency, req.IsAvailable).Scan(
		&p.ID, &p.Category, &p.TitleKo, &p.TitleEn,
		&p.DescriptionKo, &p.DescriptionEn, &p.Price, &p.PriceUSD,
		&p.Currency, &p.IsAvailable, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *ProductRepository) Update(ctx context.Context, id string, req *model.UpdateProductRequest) (*model.Product, error) {
	var p model.Product
	err := r.pool.QueryRow(ctx,
		`UPDATE products SET
			title_ko = COALESCE($2, title_ko),
			title_en = COALESCE($3, title_en),
			description_ko = COALESCE($4, description_ko),
			description_en = COALESCE($5, description_en),
			price = COALESCE($6, price),
			price_usd = COALESCE($7, price_usd),
			currency = COALESCE($8, currency),
			is_available = COALESCE($9, is_available),
			updated_at = NOW()
		WHERE id = $1
		RETURNING id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available, created_at, updated_at`,
		id, req.TitleKo, req.TitleEn, req.DescriptionKo, req.DescriptionEn,
		req.Price, req.PriceUSD, req.Currency, req.IsAvailable).Scan(
		&p.ID, &p.Category, &p.TitleKo, &p.TitleEn,
		&p.DescriptionKo, &p.DescriptionEn, &p.Price, &p.PriceUSD,
		&p.Currency, &p.IsAvailable, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *ProductRepository) Delete(ctx context.Context, id string) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM products WHERE id = $1`, id)
	return err
}
