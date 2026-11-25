import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';

test('user can sign in with email and password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();

  const { TEST_EMAIL, TEST_PASSWORD } = process.env;
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    throw new Error('Set TEST_EMAIL and TEST_PASSWORD before running the sign-in test.');
  }

  await page.locator('#email').fill(TEST_EMAIL);
  await page.locator('#password').fill(TEST_PASSWORD);

  await page.getByRole('button', { name: /sign in with email/i }).click();

  await expect(page).not.toHaveURL(/\/login/);
});