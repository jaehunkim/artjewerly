package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jaehunkim/heeang-api/internal/model"
)

type OrderRepository struct {
	pool *pgxpool.Pool
}

func NewOrderRepository(pool *pgxpool.Pool) *OrderRepository {
	return &OrderRepository{pool: pool}
}

func (r *OrderRepository) Create(ctx context.Context, req *model.CreateOrderRequest) (*model.Order, error) {
	ctx, cancel := withDBTimeout(ctx)
	defer cancel()

	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, normalizeDBError(err)
	}
	defer func() {
		_ = tx.Rollback(ctx)
	}()

	productPrices, err := r.fetchProductPrices(ctx, tx, req.Items)
	if err != nil {
		return nil, err
	}

	total := 0
	for _, item := range req.Items {
		total += productPrices[item.ProductID] * item.Quantity
	}

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
		return nil, normalizeDBError(err)
	}

	order.Items = make([]model.OrderItem, len(req.Items))
	if len(req.Items) > 0 {
		batch := &pgx.Batch{}
		for i, item := range req.Items {
			order.Items[i] = model.OrderItem{
				OrderID:   order.ID,
				ProductID: item.ProductID,
				Quantity:  item.Quantity,
				Price:     productPrices[item.ProductID],
				Currency:  order.Currency,
			}
			batch.Queue(
				`INSERT INTO order_items (order_id, product_id, quantity, price)
				VALUES ($1, $2, $3, $4)
				RETURNING id`,
				order.ID,
				item.ProductID,
				item.Quantity,
				order.Items[i].Price,
			)
		}

		results := tx.SendBatch(ctx, batch)
		for i := range order.Items {
			if err := results.QueryRow().Scan(&order.Items[i].ID); err != nil {
				_ = results.Close()
				return nil, normalizeDBError(err)
			}
		}
		if err := results.Close(); err != nil {
			return nil, normalizeDBError(err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, normalizeDBError(err)
	}

	return &order, nil
}

func (r *OrderRepository) Get(ctx context.Context, id string) (*model.Order, error) {
	ctx, cancel := withDBTimeout(ctx)
	defer cancel()

	var order model.Order
	err := r.pool.QueryRow(ctx,
		`SELECT id, email, shipping_address, total, currency, payment_provider, payment_id, status, lang, created_at
		FROM orders WHERE id = $1`, id).Scan(
		&order.ID, &order.Email, &order.ShippingAddress, &order.Total,
		&order.Currency, &order.PaymentProvider, &order.PaymentID,
		&order.Status, &order.Lang, &order.CreatedAt)
	if err != nil {
		return nil, normalizeDBError(err)
	}

	itemsByOrder, err := r.loadItems(ctx, []string{order.ID})
	if err != nil {
		return nil, err
	}
	order.Items = itemsByOrder[order.ID]
	return &order, nil
}

func (r *OrderRepository) List(ctx context.Context) ([]model.Order, error) {
	ctx, cancel := withDBTimeout(ctx)
	defer cancel()

	rows, err := r.pool.Query(ctx,
		`SELECT id, email, shipping_address, total, currency, payment_provider, payment_id, status, lang, created_at
		FROM orders ORDER BY created_at DESC LIMIT 50`)
	if err != nil {
		return nil, normalizeDBError(err)
	}
	defer rows.Close()

	var orders []model.Order
	orderIDs := make([]string, 0, 50)
	for rows.Next() {
		var o model.Order
		err := rows.Scan(&o.ID, &o.Email, &o.ShippingAddress, &o.Total,
			&o.Currency, &o.PaymentProvider, &o.PaymentID,
			&o.Status, &o.Lang, &o.CreatedAt)
		if err != nil {
			return nil, normalizeDBError(err)
		}
		orders = append(orders, o)
		orderIDs = append(orderIDs, o.ID)
	}
	if err := rows.Err(); err != nil {
		return nil, normalizeDBError(err)
	}

	itemsByOrder, err := r.loadItems(ctx, orderIDs)
	if err != nil {
		return nil, err
	}
	for i := range orders {
		orders[i].Items = itemsByOrder[orders[i].ID]
	}
	return orders, nil
}

func (r *OrderRepository) UpdateStatus(ctx context.Context, id, status string) error {
	ctx, cancel := withDBTimeout(ctx)
	defer cancel()

	tag, err := r.pool.Exec(ctx, `UPDATE orders SET status = $2 WHERE id = $1`, id, status)
	if err != nil {
		return normalizeDBError(err)
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

func (r *OrderRepository) UpdatePayment(ctx context.Context, id, provider, paymentID, status string) error {
	ctx, cancel := withDBTimeout(ctx)
	defer cancel()

	tag, err := r.pool.Exec(ctx,
		`UPDATE orders SET payment_provider = $2, payment_id = $3, status = $4 WHERE id = $1`,
		id, provider, paymentID, status)
	if err != nil {
		return normalizeDBError(err)
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

func (r *OrderRepository) fetchProductPrices(ctx context.Context, tx pgx.Tx, items []model.OrderItemRequest) (map[string]int, error) {
	productIDs := make([]string, 0, len(items))
	seen := make(map[string]struct{}, len(items))
	for _, item := range items {
		if _, exists := seen[item.ProductID]; exists {
			continue
		}
		seen[item.ProductID] = struct{}{}
		productIDs = append(productIDs, item.ProductID)
	}
	if len(productIDs) == 0 {
		return map[string]int{}, nil
	}

	rows, err := tx.Query(ctx, `SELECT id, price FROM products WHERE id = ANY($1)`, productIDs)
	if err != nil {
		return nil, normalizeDBError(err)
	}
	defer rows.Close()

	prices := make(map[string]int, len(productIDs))
	for rows.Next() {
		var productID string
		var price int
		if err := rows.Scan(&productID, &price); err != nil {
			return nil, normalizeDBError(err)
		}
		prices[productID] = price
	}
	if err := rows.Err(); err != nil {
		return nil, normalizeDBError(err)
	}
	return prices, nil
}

func (r *OrderRepository) loadItems(ctx context.Context, orderIDs []string) (map[string][]model.OrderItem, error) {
	if len(orderIDs) == 0 {
		return map[string][]model.OrderItem{}, nil
	}

	rows, err := r.pool.Query(ctx,
		`SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price,
			COALESCE(p.title_en, ''), o.currency
		FROM order_items oi
		JOIN orders o ON o.id = oi.order_id
		LEFT JOIN products p ON p.id = oi.product_id
		WHERE oi.order_id = ANY($1)
		ORDER BY oi.order_id, oi.id`,
		orderIDs,
	)
	if err != nil {
		return nil, normalizeDBError(err)
	}
	defer rows.Close()

	itemsByOrder := make(map[string][]model.OrderItem, len(orderIDs))
	for rows.Next() {
		var item model.OrderItem
		if err := rows.Scan(
			&item.ID,
			&item.OrderID,
			&item.ProductID,
			&item.Quantity,
			&item.Price,
			&item.TitleEn,
			&item.Currency,
		); err != nil {
			return nil, normalizeDBError(err)
		}
		itemsByOrder[item.OrderID] = append(itemsByOrder[item.OrderID], item)
	}
	if err := rows.Err(); err != nil {
		return nil, normalizeDBError(err)
	}

	for _, orderID := range orderIDs {
		if _, ok := itemsByOrder[orderID]; !ok {
			itemsByOrder[orderID] = []model.OrderItem{}
		}
	}
	return itemsByOrder, nil
}
