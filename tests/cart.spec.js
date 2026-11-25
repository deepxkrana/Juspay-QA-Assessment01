import { test, expect } from '@playwright/test';
import CartPage from '../pages/CartPage.js';
import LoginPage from '../pages/LoginPage.js';
import ProductPage from '../pages/ProductPage.js';

test.describe('Cart Flow', () => {
  test.beforeEach(async ({ page }) => {
    const { TEST_EMAIL, TEST_PASSWORD } = process.env;
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      throw new Error('Set TEST_EMAIL and TEST_PASSWORD before running cart tests.');
    }

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await page.locator('#email').fill(TEST_EMAIL);
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /sign in with email/i }).click();

    await expect(page).not.toHaveURL(/\/login/);
  });

  test('cart displays Metro Knit after adding it', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.openMetroKnit();
    await productPage.addToCart();
    await productPage.viewCart();

    await expect(page).toHaveURL(/\/cart\/?$/);

    const cartPage = new CartPage(page);
    await expect(cartPage.product('Metro Knit')).toBeVisible();
  });
});
