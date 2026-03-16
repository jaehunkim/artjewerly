package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jaehunkim/heeang-api/internal/model"
)

type OrderRepository struct {
	pool *pgxpool.Pool
}

func NewOrderRepository(pool *pgxpool.Pool) *OrderRepository {
	return &OrderRepository{pool: pool}
}

func (r *OrderRepository) Create(ctx context.Context, req *model.CreateOrderRequest, total int) (*model.Order, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	var order model.Order
	err = tx.QueryRow(ctx,
		`INSERT INTO orders (email, shipping_address, total, currency, lang)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, email, shipping_address, total, currency, payment_provider, payment_id, status, lang, created_at`,
		req.Email, req.ShippingAddress, total, req.Currency, req.Lang).Scan(
		&order.ID, &order.Email, &order.ShippingAddress, &order.Total,
		&order.Currency, &order.PaymentProvider, &order.PaymentID,
		&order.Status, &order.Lang, &order.CreatedAt)
	if err != nil {
		return nil, err
	}

	for _, item := range req.Items {
		_, err = tx.Exec(ctx,
			`INSERT INTO order_items (order_id, product_id, quantity, price)
			VALUES ($1, $2, $3, (SELECT COALESCE(price, 0) FROM products WHERE id = $2))`,
			order.ID, item.ProductID, item.Quantity)
		if err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return &order, nil
}

func (r *OrderRepository) Get(ctx context.Context, id string) (*model.Order, error) {
	var order model.Order
	err := r.pool.QueryRow(ctx,
		`SELECT id, email, shipping_address, total, currency, payment_provider, payment_id, status, lang, created_at
		FROM orders WHERE id = $1`, id).Scan(
		&order.ID, &order.Email, &order.ShippingAddress, &order.Total,
		&order.Currency, &order.PaymentProvider, &order.PaymentID,
		&order.Status, &order.Lang, &order.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *OrderRepository) List(ctx context.Context) ([]model.Order, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, email, shipping_address, total, currency, payment_provider, payment_id, status, lang, created_at
		FROM orders ORDER BY created_at DESC LIMIT 50`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []model.Order
	for rows.Next() {
		var o model.Order
		err := rows.Scan(&o.ID, &o.Email, &o.ShippingAddress, &o.Total,
			&o.Currency, &o.PaymentProvider, &o.PaymentID,
			&o.Status, &o.Lang, &o.CreatedAt)
		if err != nil {
			return nil, err
		}
		orders = append(orders, o)
	}
	return orders, nil
}

func (r *OrderRepository) UpdateStatus(ctx context.Context, id, status string) error {
	_, err := r.pool.Exec(ctx, `UPDATE orders SET status = $2 WHERE id = $1`, id, status)
	return err
}

func (r *OrderRepository) UpdatePayment(ctx context.Context, id, provider, paymentID, status string) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE orders SET payment_provider = $2, payment_id = $3, status = $4 WHERE id = $1`,
		id, provider, paymentID, status)
	return err
}
