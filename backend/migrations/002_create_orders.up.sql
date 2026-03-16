CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    total INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL,
    payment_provider VARCHAR(20),
    payment_id TEXT UNIQUE,
    status VARCHAR(20) DEFAULT 'pending',
    lang VARCHAR(2) DEFAULT 'ko',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price INTEGER NOT NULL
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
