import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import ProductPage from '../pages/ProductPage.js';

test.describe('Product Page Flow', () => {
  test.beforeEach(async ({ page }) => {
    const { TEST_EMAIL, TEST_PASSWORD } = process.env;
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      throw new Error('Set TEST_EMAIL and TEST_PASSWORD before running product tests.');
    }

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await page.locator('#email').fill(TEST_EMAIL);
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /sign in with email/i }).click();

    await expect(page).not.toHaveURL(/\/login/);
  });

  test('user can add Metro Knit to cart and view cart', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.openMetroKnit();

    await expect(page).toHaveURL(/\/products\/northline-metro-knit\/?$/);
    await productPage.addToCart();
    await productPage.viewCart();

    await expect(page).toHaveURL(/\/cart\/?$/);
  });
});