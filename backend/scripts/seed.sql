-- Seed artworks from leapofeveryday.com
-- Generated: 2026-03-18 v3 (exact 1:1 image mapping)

-- Clear existing data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM images;
DELETE FROM products;

-- 포자들 4 Spores 4
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '포자들 4 Spores 4', '4 Spores 4', '목걸이 Necklace. 레진, 유리 구슬, 정은 Resin, Glass beads, Sterling Silver. 길이 Length 88cm. 2021', '목걸이 Necklace. 레진, 유리 구슬, 정은 Resin, Glass beads, Sterling Silver. 길이 Length 88cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/08_Spores 4_Hee-ang Kim.c42fc92f.jpg',
  '{"thumbnail": "/images/artworks/08_Spores 4_Hee-ang Kim.c42fc92f.jpg", "medium": "/images/artworks/08_Spores 4_Hee-ang Kim.c42fc92f.jpg", "large": "/images/artworks/08_Spores 4_Hee-ang Kim.c42fc92f.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '포자들 4 Spores 4', '4 Spores 4', 0
FROM new_product;

-- 포자들 2 Spores 2
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '포자들 2 Spores 2', '2 Spores 2', '브로치 Brooch. 나무, 레진, 플로킹 파우더, 정은 Wood, Resin, Flocking powder, Sterling Silver. 6x7.8x4.5cm. 2021', '브로치 Brooch. 나무, 레진, 플로킹 파우더, 정은 Wood, Resin, Flocking powder, Sterling Silver. 6x7.8x4.5cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/08_Spore 2 Hee-ang Kim.8ef8d6cb.jpg',
  '{"thumbnail": "/images/artworks/08_Spore 2 Hee-ang Kim.8ef8d6cb.jpg", "medium": "/images/artworks/08_Spore 2 Hee-ang Kim.8ef8d6cb.jpg", "large": "/images/artworks/08_Spore 2 Hee-ang Kim.8ef8d6cb.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '포자들 2 Spores 2', '2 Spores 2', 0
FROM new_product;

-- 포자들 1 Spores 1
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '포자들 1 Spores 1', '1 Spores 1', '브로치 Brooch. 나무, 레진, 플로킹 파우더, 정은 Wood, Resin, Flocking powder, Sterling Silver. 6.5x8.8x4.6cm. 2021', '브로치 Brooch. 나무, 레진, 플로킹 파우더, 정은 Wood, Resin, Flocking powder, Sterling Silver. 6.5x8.8x4.6cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/08_Spore 1_Hee-ang Kim.18c100f1.jpg',
  '{"thumbnail": "/images/artworks/08_Spore 1_Hee-ang Kim.18c100f1.jpg", "medium": "/images/artworks/08_Spore 1_Hee-ang Kim.18c100f1.jpg", "large": "/images/artworks/08_Spore 1_Hee-ang Kim.18c100f1.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '포자들 1 Spores 1', '1 Spores 1', 0
FROM new_product;

-- 포자들 3 Spores 3
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '포자들 3 Spores 3', '3 Spores 3', '브로치 Brooch. 나무, 레진, 폴리머 클레이, 아크릴 페인트, 정은 Wood, Resin, Polymer clay, Acrylic paint, Sterling silver. 5.5x8.2x5.3cm. 2021', '브로치 Brooch. 나무, 레진, 폴리머 클레이, 아크릴 페인트, 정은 Wood, Resin, Polymer clay, Acrylic paint, Sterling silver. 5.5x8.2x5.3cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/08_Spore 3_Hee-ang Kim.d7a67356.jpg',
  '{"thumbnail": "/images/artworks/08_Spore 3_Hee-ang Kim.d7a67356.jpg", "medium": "/images/artworks/08_Spore 3_Hee-ang Kim.d7a67356.jpg", "large": "/images/artworks/08_Spore 3_Hee-ang Kim.d7a67356.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '포자들 3 Spores 3', '3 Spores 3', 0
FROM new_product;

-- 재구성된 형태 6 Re-form 6
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '재구성된 형태 6 Re-form 6', '6 Re-form 6', '목걸이 Necklace. 폴리머클레이, 석분점토,정은, 아크릴 페인트 Polymer clay, Stone clay, Sterling silver, Acrylic paint. 9.4x13.2x2.8cm, 길이 Length 56cm. 2021', '목걸이 Necklace. 폴리머클레이, 석분점토,정은, 아크릴 페인트 Polymer clay, Stone clay, Sterling silver, Acrylic paint. 9.4x13.2x2.8cm, 길이 Length 56cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/08_Re-form 6_Hee-ang Kim.47ea5d3d.jpg',
  '{"thumbnail": "/images/artworks/08_Re-form 6_Hee-ang Kim.47ea5d3d.jpg", "medium": "/images/artworks/08_Re-form 6_Hee-ang Kim.47ea5d3d.jpg", "large": "/images/artworks/08_Re-form 6_Hee-ang Kim.47ea5d3d.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '재구성된 형태 6 Re-form 6', '6 Re-form 6', 0
FROM new_product;

-- Wavy 3
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', 'Wavy 3', 'Wavy 3', '브로치 Brooch. 석분점토, 정은, 아크릴 페인트 Stone clay, Sterling silver, Acrylic paint. 9.2x10x4.8cm. 2021', '브로치 Brooch. 석분점토, 정은, 아크릴 페인트 Stone clay, Sterling silver, Acrylic paint. 9.2x10x4.8cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/07_Wavy 3_Hee-ang Kim.cc349393.jpg',
  '{"thumbnail": "/images/artworks/07_Wavy 3_Hee-ang Kim.cc349393.jpg", "medium": "/images/artworks/07_Wavy 3_Hee-ang Kim.cc349393.jpg", "large": "/images/artworks/07_Wavy 3_Hee-ang Kim.cc349393.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  'Wavy 3', 'Wavy 3', 0
FROM new_product;

-- Wavy 1
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', 'Wavy 1', 'Wavy 1', '귀걸이 Earrings. 정은, 폴리머클레이, 아크릴 페인트 Sterling silver, Polymer clay, Acrylic paint. 3.8x3.8x1.6cm, 3.4x3.4x1.4cm. 2021', '귀걸이 Earrings. 정은, 폴리머클레이, 아크릴 페인트 Sterling silver, Polymer clay, Acrylic paint. 3.8x3.8x1.6cm, 3.4x3.4x1.4cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/07_Wavy 1 _Hee-ang Kim.bbe10166.jpg',
  '{"thumbnail": "/images/artworks/07_Wavy 1 _Hee-ang Kim.bbe10166.jpg", "medium": "/images/artworks/07_Wavy 1 _Hee-ang Kim.bbe10166.jpg", "large": "/images/artworks/07_Wavy 1 _Hee-ang Kim.bbe10166.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  'Wavy 1', 'Wavy 1', 0
FROM new_product;

-- 재구성된 형태 3 Re-form 3
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '재구성된 형태 3 Re-form 3', '3 Re-form 3', '목걸이 Necklace. 폴리머클레이, 석분점토,정은, 아크릴 페인트, 레진, 실리콘 끈 Polymer clay, Stone clay, Sterling silver, Acrylic paint, Resin, Silicone string. 4.4x7.6x3cm, 길이 Length 86cm. 2021', '목걸이 Necklace. 폴리머클레이, 석분점토,정은, 아크릴 페인트, 레진, 실리콘 끈 Polymer clay, Stone clay, Sterling silver, Acrylic paint, Resin, Silicone string. 4.4x7.6x3cm, 길이 Length 86cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/07_Re-form 3_Hee-ang Kim.f2c6862c.jpg',
  '{"thumbnail": "/images/artworks/07_Re-form 3_Hee-ang Kim.f2c6862c.jpg", "medium": "/images/artworks/07_Re-form 3_Hee-ang Kim.f2c6862c.jpg", "large": "/images/artworks/07_Re-form 3_Hee-ang Kim.f2c6862c.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '재구성된 형태 3 Re-form 3', '3 Re-form 3', 0
FROM new_product;

-- Wavy 2
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', 'Wavy 2', 'Wavy 2', '목걸이 Necklace. 정은, 폴리머클레이, 아크릴 페인트 Sterling silver, Polymer clay, Acrylic paint. 길이 Length 52cm. 2021', '목걸이 Necklace. 정은, 폴리머클레이, 아크릴 페인트 Sterling silver, Polymer clay, Acrylic paint. 길이 Length 52cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/07_Wavy 2 _Hee-ang Kim.d3e59112.jpg',
  '{"thumbnail": "/images/artworks/07_Wavy 2 _Hee-ang Kim.d3e59112.jpg", "medium": "/images/artworks/07_Wavy 2 _Hee-ang Kim.d3e59112.jpg", "large": "/images/artworks/07_Wavy 2 _Hee-ang Kim.d3e59112.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  'Wavy 2', 'Wavy 2', 0
FROM new_product;

-- 피고 지다 9 Bloom and Wither 9
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '피고 지다 9 Bloom and Wither 9', '9 Bloom and Wither 9', '브로치 Brooch. 정은에 착색, 석분점토, 레진, 아크릴 페인트 Sterling silver, Stone clay, Resin, Acrylic paint. 10.1x15.2x6.4cm. 2019', '브로치 Brooch. 정은에 착색, 석분점토, 레진, 아크릴 페인트 Sterling silver, Stone clay, Resin, Acrylic paint. 10.1x15.2x6.4cm. 2019', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/05_Bloom and Wither 9_Hee-ang Kim.c047198d.jpg',
  '{"thumbnail": "/images/artworks/05_Bloom and Wither 9_Hee-ang Kim.c047198d.jpg", "medium": "/images/artworks/05_Bloom and Wither 9_Hee-ang Kim.c047198d.jpg", "large": "/images/artworks/05_Bloom and Wither 9_Hee-ang Kim.c047198d.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '피고 지다 9 Bloom and Wither 9', '9 Bloom and Wither 9', 0
FROM new_product;

-- 피고 지다 11 Bloom and Wither 11
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '피고 지다 11 Bloom and Wither 11', '11 Bloom and Wither 11', '브로치 Brooch. 2019. 정은, 석분점토, 레진, 엠보싱 파우더 Sterling silver, Stone clay, Resin, Embossing powder', '브로치 Brooch. 2019. 정은, 석분점토, 레진, 엠보싱 파우더 Sterling silver, Stone clay, Resin, Embossing powder', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/05_Bloom and Wither 11_Hee-ang Kim.959ee145.jpg',
  '{"thumbnail": "/images/artworks/05_Bloom and Wither 11_Hee-ang Kim.959ee145.jpg", "medium": "/images/artworks/05_Bloom and Wither 11_Hee-ang Kim.959ee145.jpg", "large": "/images/artworks/05_Bloom and Wither 11_Hee-ang Kim.959ee145.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '피고 지다 11 Bloom and Wither 11', '11 Bloom and Wither 11', 0
FROM new_product;

-- 피어나다 7 Blooming 7
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '피어나다 7 Blooming 7', '7 Blooming 7', '브로치 Brooch. 정은, 석분점토, 폴리머 클레이 Sterling silver, Stone clay, Polymer clay. 10.2x12.1x4.5cm. 2019', '브로치 Brooch. 정은, 석분점토, 폴리머 클레이 Sterling silver, Stone clay, Polymer clay. 10.2x12.1x4.5cm. 2019', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/05_Blooming 7_Hee-ang Kim.40018bdc.jpg',
  '{"thumbnail": "/images/artworks/05_Blooming 7_Hee-ang Kim.40018bdc.jpg", "medium": "/images/artworks/05_Blooming 7_Hee-ang Kim.40018bdc.jpg", "large": "/images/artworks/05_Blooming 7_Hee-ang Kim.40018bdc.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '피어나다 7 Blooming 7', '7 Blooming 7', 0
FROM new_product;

-- 재구성된 형태 2 Re-form 2
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '재구성된 형태 2 Re-form 2', '2 Re-form 2', '브로치 Brooch. 폴리머클레이, 석분점토,정은, 아크릴 페인트 Polymer clay, Stone clay, Sterling silver, Acrylic paint. 5.1x7x3.2cm. 2021', '브로치 Brooch. 폴리머클레이, 석분점토,정은, 아크릴 페인트 Polymer clay, Stone clay, Sterling silver, Acrylic paint. 5.1x7x3.2cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/05_Heart brooch_Hee-ang Kim.7cc067bb.jpg',
  '{"thumbnail": "/images/artworks/05_Heart brooch_Hee-ang Kim.7cc067bb.jpg", "medium": "/images/artworks/05_Heart brooch_Hee-ang Kim.7cc067bb.jpg", "large": "/images/artworks/05_Heart brooch_Hee-ang Kim.7cc067bb.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '재구성된 형태 2 Re-form 2', '2 Re-form 2', 0
FROM new_product;

-- 시작점 Starting point
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '시작점 Starting point', 'Starting point', '브로치 Brooch. 폴리머클레이, 석분점토, 아크릴 물감, 정은 Polymer clay, Stone clay, Acrylic paint, Sterling silver. 7.4x11.6x4.5cm. 2021', '브로치 Brooch. 폴리머클레이, 석분점토, 아크릴 물감, 정은 Polymer clay, Stone clay, Acrylic paint, Sterling silver. 7.4x11.6x4.5cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/05_Starting point_Hee-ang Kim.214c4462.jpg',
  '{"thumbnail": "/images/artworks/05_Starting point_Hee-ang Kim.214c4462.jpg", "medium": "/images/artworks/05_Starting point_Hee-ang Kim.214c4462.jpg", "large": "/images/artworks/05_Starting point_Hee-ang Kim.214c4462.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '시작점 Starting point', 'Starting point', 0
FROM new_product;

-- 재구성된 형태 1 Re-form 1
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '재구성된 형태 1 Re-form 1', '1 Re-form 1', '브로치 Brooch. 폴리머클레이, 석분점토,정은, 아크릴 페인트 Polymer clay, Stone clay, Sterling silver, Acrylic paint. 7.2x6.5x4.5cm. 2021', '브로치 Brooch. 폴리머클레이, 석분점토,정은, 아크릴 페인트 Polymer clay, Stone clay, Sterling silver, Acrylic paint. 7.2x6.5x4.5cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/05_Re-form 1 _Hee-ang Kim.4315a2c0.jpg',
  '{"thumbnail": "/images/artworks/05_Re-form 1 _Hee-ang Kim.4315a2c0.jpg", "medium": "/images/artworks/05_Re-form 1 _Hee-ang Kim.4315a2c0.jpg", "large": "/images/artworks/05_Re-form 1 _Hee-ang Kim.4315a2c0.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '재구성된 형태 1 Re-form 1', '1 Re-form 1', 0
FROM new_product;

-- 피어나는 순간 The first buds
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '피어나는 순간 The first buds', 'The first buds', '귀걸이 Earrings. 폴리머 클레이, 레진, 황동, 정은, 금도금 Polymer clay, Resin, Brass, Sterling silver, Gold plated. 5.7x8.3x3, 4.8x8.7x3cm. 2021', '귀걸이 Earrings. 폴리머 클레이, 레진, 황동, 정은, 금도금 Polymer clay, Resin, Brass, Sterling silver, Gold plated. 5.7x8.3x3, 4.8x8.7x3cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/02_The first buds_Hee-ang Kim.71c68892.jpg',
  '{"thumbnail": "/images/artworks/02_The first buds_Hee-ang Kim.71c68892.jpg", "medium": "/images/artworks/02_The first buds_Hee-ang Kim.71c68892.jpg", "large": "/images/artworks/02_The first buds_Hee-ang Kim.71c68892.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '피어나는 순간 The first buds', 'The first buds', 0
FROM new_product;

-- 재구성된 형태 5 Re-form 5
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '재구성된 형태 5 Re-form 5', '5 Re-form 5', '목걸이 Necklace. 폴리머클레이, 석분점토,정은, 아크릴 페인트 Polymer clay, Stone clay, Sterling silver, Acrylic paint. 10.3x8.7x3.8cm, 길이 Length 56cm. 2021', '목걸이 Necklace. 폴리머클레이, 석분점토,정은, 아크릴 페인트 Polymer clay, Stone clay, Sterling silver, Acrylic paint. 10.3x8.7x3.8cm, 길이 Length 56cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/02_Re-form 5_Hee-ang Kim.bfb592bb.jpg',
  '{"thumbnail": "/images/artworks/02_Re-form 5_Hee-ang Kim.bfb592bb.jpg", "medium": "/images/artworks/02_Re-form 5_Hee-ang Kim.bfb592bb.jpg", "large": "/images/artworks/02_Re-form 5_Hee-ang Kim.bfb592bb.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '재구성된 형태 5 Re-form 5', '5 Re-form 5', 0
FROM new_product;

-- 재구성된 형태 4 Re-form 4
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '재구성된 형태 4 Re-form 4', '4 Re-form 4', '목걸이 Necklace. 폴리머클레이, 석분점토,정은, 아크릴 페인트, 레진 Polymer clay, Stone clay, Sterling silver, Acrylic paint, Resin. 9x10.4x4cm, Length 68cm. 2021', '목걸이 Necklace. 폴리머클레이, 석분점토,정은, 아크릴 페인트, 레진 Polymer clay, Stone clay, Sterling silver, Acrylic paint, Resin. 9x10.4x4cm, Length 68cm. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/01_Re-form-4_Hee-ang-Kim.c0046ff6.jpg',
  '{"thumbnail": "/images/artworks/01_Re-form-4_Hee-ang-Kim.c0046ff6.jpg", "medium": "/images/artworks/01_Re-form-4_Hee-ang-Kim.c0046ff6.jpg", "large": "/images/artworks/01_Re-form-4_Hee-ang-Kim.c0046ff6.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '재구성된 형태 4 Re-form 4', '4 Re-form 4', 0
FROM new_product;

-- 군집 9 Cluster 9
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '군집 9 Cluster 9', '9 Cluster 9', '브로치 Brooch. 폴리머클레이, 아크릴 물감, 정은, 알루미늄, Polymer clay, Acrylic paint, Sterling silver, Aluminium. 9x12x3.5cm. 2018', '브로치 Brooch. 폴리머클레이, 아크릴 물감, 정은, 알루미늄, Polymer clay, Acrylic paint, Sterling silver, Aluminium. 9x12x3.5cm. 2018', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/01_Cluster-9_Hee-ang-Kim.b7e5c368.jpg',
  '{"thumbnail": "/images/artworks/01_Cluster-9_Hee-ang-Kim.b7e5c368.jpg", "medium": "/images/artworks/01_Cluster-9_Hee-ang-Kim.b7e5c368.jpg", "large": "/images/artworks/01_Cluster-9_Hee-ang-Kim.b7e5c368.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '군집 9 Cluster 9', '9 Cluster 9', 0
FROM new_product;

-- 군집 17 Cluster 17
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', '군집 17 Cluster 17', '17 Cluster 17', '브로치 Brooch. 폴리머클레이, 아크릴 물감, 정은, Polymer clay, Acrylic paint, Sterling silver. 7.2x9.8x2.2cm. 2020', '브로치 Brooch. 폴리머클레이, 아크릴 물감, 정은, Polymer clay, Acrylic paint, Sterling silver. 7.2x9.8x2.2cm. 2020', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/01_Cluster-17_Hee-ang-Kim.4eedce99.jpg',
  '{"thumbnail": "/images/artworks/01_Cluster-17_Hee-ang-Kim.4eedce99.jpg", "medium": "/images/artworks/01_Cluster-17_Hee-ang-Kim.4eedce99.jpg", "large": "/images/artworks/01_Cluster-17_Hee-ang-Kim.4eedce99.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '군집 17 Cluster 17', '17 Cluster 17', 0
FROM new_product;

-- Wavy 4
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'art', 'Wavy 4', 'Wavy 4', 'Wavy 4. 거울, 나무, 점토 Mirror, Wood, Clay. 거울. 2021', 'Wavy 4. 거울, 나무, 점토 Mirror, Wood, Clay. 거울. 2021', NULL, NULL, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/04_Wavy 4_Hee-ang Kim.0360d0a3.jpg',
  '{"thumbnail": "/images/artworks/04_Wavy 4_Hee-ang Kim.0360d0a3.jpg", "medium": "/images/artworks/04_Wavy 4_Hee-ang Kim.0360d0a3.jpg", "large": "/images/artworks/04_Wavy 4_Hee-ang Kim.0360d0a3.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  'Wavy 4', 'Wavy 4', 0
FROM new_product;

-- Cluster E
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'sale', 'Cluster E', 'Cluster E', '귀걸이 Earrings. 정은, 폴리머클레이 Sterling silver, Polymer clay', '귀걸이 Earrings. 정은, 폴리머클레이 Sterling silver, Polymer clay', 50000, 3800, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/03_Cluster E_BB1.b2eb00a7.jpg',
  '{"thumbnail": "/images/artworks/03_Cluster E_BB1.b2eb00a7.jpg", "medium": "/images/artworks/03_Cluster E_BB1.b2eb00a7.jpg", "large": "/images/artworks/03_Cluster E_BB1.b2eb00a7.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  'Cluster E', 'Cluster E', 0
FROM new_product;

-- M pin 4
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'sale', 'M pin 4', 'M pin 4', '(Left)브로치 Brooch. 2020. 석분점토, 폴리머 클레이, 황동, 아크릴 페인트 Stone clay, Polymer clay, Brass, Acrylic paint', '(Left)브로치 Brooch. 2020. 석분점토, 폴리머 클레이, 황동, 아크릴 페인트 Stone clay, Polymer clay, Brass, Acrylic paint', 50000, 3800, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/03_M Pin 3,4.7a93563b.jpeg',
  '{"thumbnail": "/images/artworks/03_M Pin 3,4.7a93563b.jpeg", "medium": "/images/artworks/03_M Pin 3,4.7a93563b.jpeg", "large": "/images/artworks/03_M Pin 3,4.7a93563b.jpeg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  'M pin 4', 'M pin 4', 0
FROM new_product;

-- Mboutonniere 6, 7
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'sale', 'Mboutonniere 6, 7', 'Mboutonniere 6, 7', '브로치 Brooch. 폴리머클레이, 석분점토, 레진, 황동 Polymer clay, Stone clay, Resin, Brass', '브로치 Brooch. 폴리머클레이, 석분점토, 레진, 황동 Polymer clay, Stone clay, Resin, Brass', 50000, 3800, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/03_Mboutonniere 6, 7.f8889469.JPG',
  '{"thumbnail": "/images/artworks/03_Mboutonniere 6, 7.f8889469.JPG", "medium": "/images/artworks/03_Mboutonniere 6, 7.f8889469.JPG", "large": "/images/artworks/03_Mboutonniere 6, 7.f8889469.JPG", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  'Mboutonniere 6, 7', 'Mboutonniere 6, 7', 0
FROM new_product;

-- Blooming 2
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'sale', 'Blooming 2', 'Blooming 2', '브로치 Brooch. 폴리머클레이, 정은 Polymer clay, Sterling silver. 5.2x7.2x3.7cm. 2019', '브로치 Brooch. 폴리머클레이, 정은 Polymer clay, Sterling silver. 5.2x7.2x3.7cm. 2019', 50000, 3800, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/03_Blooming2_Hee-ang Kim.d19edc60.jpg',
  '{"thumbnail": "/images/artworks/03_Blooming2_Hee-ang Kim.d19edc60.jpg", "medium": "/images/artworks/03_Blooming2_Hee-ang Kim.d19edc60.jpg", "large": "/images/artworks/03_Blooming2_Hee-ang Kim.d19edc60.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  'Blooming 2', 'Blooming 2', 0
FROM new_product;

-- M pin 3
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'sale', 'M pin 3', 'M pin 3', '(Right)브로치 Brooch. 2020. 석분점토, 폴리머 클레이, 황동, 아크릴 페인트 Stone clay, Polymer clay, Brass, Acrylic paint', '(Right)브로치 Brooch. 2020. 석분점토, 폴리머 클레이, 황동, 아크릴 페인트 Stone clay, Polymer clay, Brass, Acrylic paint', 50000, 3800, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/04_Wavy-4_2-Hee-ang-Kim.5c1e08cf.jpg',
  '{"thumbnail": "/images/artworks/04_Wavy-4_2-Hee-ang-Kim.5c1e08cf.jpg", "medium": "/images/artworks/04_Wavy-4_2-Hee-ang-Kim.5c1e08cf.jpg", "large": "/images/artworks/04_Wavy-4_2-Hee-ang-Kim.5c1e08cf.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  'M pin 3', 'M pin 3', 0
FROM new_product;

-- 버섯 귀걸이 대 Mushroom earrings L
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'sale', '버섯 귀걸이 대 Mushroom earrings L', 'Mushroom earrings L', '귀걸이 Earrings. 2020. 정은에 금도금, 폴리머클레이 Gold plated Sterling silver, Polymer clay', '귀걸이 Earrings. 2020. 정은에 금도금, 폴리머클레이 Gold plated Sterling silver, Polymer clay', 50000, 3800, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/03_Mushroom earrings L.9309e73a.JPG',
  '{"thumbnail": "/images/artworks/03_Mushroom earrings L.9309e73a.JPG", "medium": "/images/artworks/03_Mushroom earrings L.9309e73a.JPG", "large": "/images/artworks/03_Mushroom earrings L.9309e73a.JPG", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  '버섯 귀걸이 대 Mushroom earrings L', 'Mushroom earrings L', 0
FROM new_product;

-- Blooming 3
WITH new_product AS (
  INSERT INTO products (id, category, title_ko, title_en, description_ko, description_en, price, price_usd, currency, is_available)
  VALUES (gen_random_uuid(), 'sale', 'Blooming 3', 'Blooming 3', '브로치 Brooch. 2019. 폴리머클레이, 석분점토, 아크릴 물감, 정은 Polymer clay, Stone clay, Acrylic paint, Sterling silver', '브로치 Brooch. 2019. 폴리머클레이, 석분점토, 아크릴 물감, 정은 Polymer clay, Stone clay, Acrylic paint, Sterling silver', 50000, 3800, 'KRW', true)
  RETURNING id
)
INSERT INTO images (id, product_id, r2_key, variants, alt_ko, alt_en, sort_order)
SELECT gen_random_uuid(), id, 'local/03_Blooming 3_Hee-ang Kim.bfd967ef.jpg',
  '{"thumbnail": "/images/artworks/03_Blooming 3_Hee-ang Kim.bfd967ef.jpg", "medium": "/images/artworks/03_Blooming 3_Hee-ang Kim.bfd967ef.jpg", "large": "/images/artworks/03_Blooming 3_Hee-ang Kim.bfd967ef.jpg", "blur": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII="}'::jsonb,
  'Blooming 3', 'Blooming 3', 0
FROM new_product;
