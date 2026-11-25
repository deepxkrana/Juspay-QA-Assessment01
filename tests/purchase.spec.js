const { test, expect } = require('@playwright/test');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const LoginPage = require('../pages/LoginPage');
const PaymentPage = require('../pages/PaymentPage');
const ProductPage = require('../pages/ProductPage');
const testAddress = require('../data/checkoutAddress');
const paymentDetails = require('../data/paymentDetails');

test.setTimeout(120_000);

test('user can complete the home-to-payment flow', async ({ page }) => {
  const { TEST_EMAIL, TEST_PASSWORD } = process.env;
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    throw new Error('Set TEST_EMAIL and TEST_PASSWORD before running the purchase flow.');
  }

  const loginPage = new LoginPage(page);
  await loginPage.openHome();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Kickstead' })).toBeVisible();

  await loginPage.openLogin();
  await expect(page).toHaveURL(/\/login\/?$/);
  await page.locator('#email').fill(TEST_EMAIL);
  await page.locator('#password').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /sign in with email/i }).click();
  await expect(page).not.toHaveURL(/\/login/);

  const productPage = new ProductPage(page);
  await productPage.openMetroKnit();
  await expect(page).toHaveURL(/\/products\/northline-metro-knit\/?$/);
  await productPage.addToCart();
  await productPage.viewCart();

  const cartPage = new CartPage(page);
  await expect(page).toHaveURL(/\/cart\/?$/);
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

  const existingOrderLink = page.getByRole('link', { name: /go to that order/i });
  if (await existingOrderLink.count()) {
    await existingOrderLink.click();
  }
  await expect(page).toHaveURL(/\/orders\/[^/]+\/?$/);
  const orderId = new URL(page.url()).pathname.match(/^\/orders\/([^/]+)\/?$/)?.[1];
  expect(orderId, 'Order URL should contain the generated order ID').toBeTruthy();

  const paymentPage = new PaymentPage(page);
  await paymentPage.fillCardDetails(paymentDetails);
  await expect(page.getByLabel('Card number')).toHaveValue(paymentDetails.cardNumber);
  await paymentPage.proceedToOtp();
  await paymentPage.fillOtp(paymentDetails.otp);
  await expect(page.locator('input[autocomplete="one-time-code"]')).toHaveValue(paymentDetails.otp);
  await paymentPage.verifyAndPay();
  await expect(page.getByRole('status')).toContainText('Payment successful.');
});
