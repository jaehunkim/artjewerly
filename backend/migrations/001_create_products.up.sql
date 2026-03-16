CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(10) NOT NULL CHECK (category IN ('art', 'sale')),
    title_ko TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ko TEXT,
    description_en TEXT,
    price INTEGER,
    price_usd INTEGER,
    currency VARCHAR(3) DEFAULT 'KRW',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    r2_key TEXT NOT NULL,
    variants JSONB NOT NULL DEFAULT '{}',
    alt_ko TEXT,
    alt_en TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_images_product_id ON images(product_id);
