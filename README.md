# Kickstead storefront tests
# Juspay QE payment automation assessment

This project uses Playwright to test [Kickstead](https://kickstead.vercel.app/), a demo footwear store. You can try the storefront yourself or run the browser tests in this repo.

The checkout uses a simulated payment gateway. The test card and OTP are dummy values; no real payment is made.

## Try the demo

1. Open [kickstead.vercel.app](https://kickstead.vercel.app/).
2. Sign in with an authorized demo or test account.
3. Open the shop and select **Metro Knit**.
4. Choose **Add to cart**, then **View cart**.
5. In the cart, choose **Checkout**. Add or select a delivery address, then choose **Place order**.
6. On the order page, enter the dummy card details, choose **Proceed to OTP**, enter the dummy OTP, and choose **Verify & Pay**.
7. The order page should show that the simulated payment succeeded.

The address used by the automated tests is in [`data/checkoutAddress.js`](./data/checkoutAddress.js). The dummy card and OTP are in [`data/paymentDetails.js`](./data/paymentDetails.js).

## Set up the tests

You will need Node.js, npm, and access to the storefront.

```sh
npm install
npx playwright install chromium
cp .env.example .env
```

Open `.env` and set `TEST_EMAIL` and `TEST_PASSWORD` to the credentials for your authorized test account. `BASE_URL` is already set to the Kickstead demo site. Keep `.env` private; it is ignored by Git.

## Run the tests

To run the main journey from the home page through payment:

```sh
npm run test:purchase
```

**NOTE**
To watch that same journey in a visible browser:

```sh
npm run test:headed
```

The purchase test signs in once, then visits the product, cart, checkout, and payment pages in sequence.

There are also focused tests for each stage. Each focused test signs in separately:

```sh
npm test -- tests/login.spec.js
npm test -- tests/product.spec.js
npm test -- tests/cart.spec.js
npm test -- tests/checkout.spec.js
npm test -- tests/payment.spec.js
```

Run all tests with `npm test`. To run every focused spec in a visible browser:

```sh
npm run test:headed:all
```

Each focused spec is an independent test and signs in separately, so the login page will appear again between specs. This is expected. To watch the full shopping journey with one sign-in, use `npm run test:headed` instead.

The tests run one at a time because they share an account and can change its cart or orders. Use a dedicated test account; repeated runs may leave test orders in its order history.

Playwright records video, saves screenshots on failure, and captures a trace on the first retry. To open the HTML report after a run:

```sh
npm run report
```
**NOTE**
If the above command throws error, run `npx playwright show-report`

## Project layout

```text
pages/       Page objects and reusable page actions
tests/       Focused tests and the full purchase journey
data/        Test address and dummy payment details
fixtures/    Shared Playwright fixtures, when needed
utils/       Shared helpers, when needed
```
