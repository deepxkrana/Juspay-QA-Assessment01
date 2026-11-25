import { test, expect } from '@playwright/test';
import CartPage from '../pages/CartPage.js';
import CheckoutPage from '../pages/CheckoutPage.js';
import LoginPage from '../pages/LoginPage.js';
import PaymentPage from '../pages/PaymentPage.js';
import ProductPage from '../pages/ProductPage.js';
import paymentDetails from '../data/paymentDetails.js';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    const { TEST_EMAIL, TEST_PASSWORD } = process.env;
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      throw new Error('Set TEST_EMAIL and TEST_PASSWORD before running payment tests.');
    }

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await page.locator('#email').fill(TEST_EMAIL);
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /sign in with email/i }).click();

    await expect(page).not.toHaveURL(/\/login/);
  });

  test('user can complete a demo card payment with OTP', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.openMetroKnit();
    await productPage.addToCart();
    await productPage.viewCart();

    const cartPage = new CartPage(page);
    await cartPage.checkout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.placeOrder();

    const existingOrderLink = page.getByRole('link', { name: /go to that order/i });
    if (await existingOrderLink.count()) {
      await existingOrderLink.click();
    }
    await expect(page).toHaveURL(/\/orders\/[^/]+\/?$/);

    const paymentPage = new PaymentPage(page);
    await paymentPage.fillCardDetails(paymentDetails);

    await expect(page.getByLabel('Name on card')).toHaveValue(paymentDetails.cardholderName);
    await expect(page.getByLabel('Card number')).toHaveValue(paymentDetails.cardNumber);
    await expect(page.getByLabel('Expiry date')).toHaveValue(paymentDetails.expiryDate);
    await expect(page.getByLabel('CVV / Security code')).toHaveValue(paymentDetails.securityCode);

    await paymentPage.proceedToOtp();
    await paymentPage.fillOtp(paymentDetails.otp);
    await expect(page.locator('input[autocomplete="one-time-code"]')).toHaveValue(paymentDetails.otp);
    await paymentPage.verifyAndPay();

    await expect(page).toHaveURL(/\/orders\/[^/]+\/?$/);
    await expect(page.getByRole('status')).toContainText('Payment successful.');
  });
});
