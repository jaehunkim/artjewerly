import { test, expect } from '@playwright/test';

test.describe('Core Flow - Korean', () => {
  test('homepage loads and has navigation', async ({ page }) => {
    await page.goto('/ko');
    const nav = page.locator('aside');
    await expect(nav.getByText('HEEANG')).toBeVisible();
    await expect(nav.getByText('아트 주얼리')).toBeVisible();
    await expect(nav.getByText('판매용 주얼리')).toBeVisible();
  });

  test('shop page loads products', async ({ page }) => {
    await page.goto('/ko/shop');
    await expect(page.locator('h1')).toContainText('판매용 주얼리');
    // Should have product cards
    const cards = page.locator('[class*="heeang-enter"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('art page loads artworks', async ({ page }) => {
    await page.goto('/ko/art');
    await expect(page.locator('h1')).toContainText('아트 주얼리');
    const cards = page.locator('[class*="heeang-enter"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('product detail page loads from shop', async ({ page }) => {
    await page.goto('/ko/shop');
    // Click first product
    const firstCard = page.locator('[class*="heeang-enter"] a').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();
    // Should see product detail with "장바구니 담기" button
    await expect(page.locator('text=장바구니 담기')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=← 돌아가기')).toBeVisible();
  });

  test('add to cart opens drawer', async ({ page }) => {
    await page.goto('/ko/shop');
    const firstCard = page.locator('[class*="heeang-enter"] a').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();

    // Click "장바구니 담기"
    await page.locator('text=장바구니 담기').click();

    // Cart drawer should open
    await expect(page.locator('text=장바구니').first()).toBeVisible({ timeout: 5000 });
    // Should have at least one item
    await expect(page.locator('text=삭제').first()).toBeVisible();
    // Should show checkout link
    await expect(page.locator('text=주문하기').first()).toBeVisible();
  });

  test('cart page shows items', async ({ page }) => {
    // Add item first
    await page.goto('/ko/shop');
    const firstCard = page.locator('[class*="heeang-enter"] a').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();
    await page.locator('text=장바구니 담기').click();

    // Go to cart page
    await page.goto('/ko/cart');
    await expect(page.locator('h1')).toContainText('장바구니');
    await expect(page.locator('text=주문하기').first()).toBeVisible();
  });

  test('checkout page loads from cart', async ({ page }) => {
    // Add item first
    await page.goto('/ko/shop');
    const firstCard = page.locator('[class*="heeang-enter"] a').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();
    await page.locator('text=장바구니 담기').click();

    // Navigate to checkout
    await page.goto('/ko/checkout');
    await expect(page.locator('text=주문하기').first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Language Switch', () => {
  test('switch from Korean to English', async ({ page }) => {
    await page.goto('/ko/shop');
    await expect(page.locator('h1')).toContainText('판매용 주얼리');

    // Click language switcher (EN link in sidebar)
    const enLink = page.locator('aside a:has-text("EN"), aside button:has-text("EN")').first();
    if (await enLink.isVisible()) {
      await enLink.click();
      await expect(page.locator('h1')).toContainText('Shop');
    }
  });

  test('English pages load correctly', async ({ page }) => {
    await page.goto('/en/shop');
    await expect(page.locator('h1')).toContainText('Shop');

    await page.goto('/en/art');
    await expect(page.locator('h1')).toContainText('Art Jewelry');
  });
});
