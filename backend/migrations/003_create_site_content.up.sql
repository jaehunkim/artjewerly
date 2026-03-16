CREATE TABLE site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page VARCHAR(50) NOT NULL UNIQUE,
    content_ko TEXT,
    content_en TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_content (page, content_ko, content_en)
VALUES ('info', 'Heeang Jewelry에 오신 것을 환영합니다.', 'Welcome to Heeang Jewelry.');
