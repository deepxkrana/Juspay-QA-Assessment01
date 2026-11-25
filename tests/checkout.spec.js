const { test, expect } = require('@playwright/test');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const LoginPage = require('../pages/LoginPage');
const ProductPage = require('../pages/ProductPage');
const testAddress = require('../data/checkoutAddress');

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    const { TEST_EMAIL, TEST_PASSWORD } = process.env;
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      throw new Error('Set TEST_EMAIL and TEST_PASSWORD before running checkout tests.');
    }

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await page.locator('#email').fill(TEST_EMAIL);
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /sign in with email/i }).click();

    await expect(page).not.toHaveURL(/\/login/);
  });

  test('user can place an order with a new address', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.openMetroKnit();
    await productPage.addToCart();
    await productPage.viewCart();

    await expect(page).toHaveURL(/\/cart\/?$/);

    const cartPage = new CartPage(page);
    await expect(cartPage.product('Metro Knit')).toBeVisible();
    await cartPage.checkout();

    await expect(page).toHaveURL(/\/checkout\/?$/);

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.addNewAddress();
    await checkoutPage.fillAddress(testAddress);

    await expect(page.getByLabel('Full name')).toHaveValue(testAddress.fullName);
    await expect(page.getByLabel('Phone')).toHaveValue(testAddress.phone);
    await expect(page.getByLabel('PIN code')).toHaveValue(testAddress.postalCode);
    await expect(page.getByLabel('Address line 1')).toHaveValue(testAddress.addressLine1);
    await expect(page.getByLabel('Address line 2 (optional)')).toHaveValue(testAddress.addressLine2);
    await expect(page.getByLabel('City')).toHaveValue(testAddress.city);
    await expect(page.getByLabel('State')).toHaveValue(testAddress.state);
    await expect(page.getByLabel('Country')).toHaveValue(testAddress.country);

    await checkoutPage.useThisAddress();
    await checkoutPage.placeOrder();

    await expect(page.getByRole('alert')).toBeHidden();
    await expect(page).toHaveURL(/\/orders\/[^/]+\/?$/);

    const orderId = new URL(page.url()).pathname.match(/^\/orders\/([^/]+)\/?$/)?.[1];
    expect(orderId, 'Order URL should contain the generated order ID').toBeTruthy();
  });
});
