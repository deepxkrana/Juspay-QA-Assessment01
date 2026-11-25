# Juspay Playwright E2E Tests

This project contains end-to-end browser tests for the Kickstead storefront. The tests use Playwright Test and run in Chromium.

## Covered workflows

- Login (`tests/login.spec.js`): opens the configured base URL, navigates to `/login`, signs in with email and password, and verifies that the page leaves the login route.
- Product (`tests/product.spec.js`): signs in, opens `/products`, selects Metro Knit, adds it to the cart, clicks View cart, and verifies navigation to `/cart`.
- Cart (`tests/cart.spec.js`): signs in, adds Metro Knit to the cart, opens the cart, and verifies the product is displayed.

Each spec performs its own sign-in; the tests do not depend on running in a particular order. The product and cart tests add an item to the signed-in account's cart, so use a dedicated test account.

## Prerequisites

- Node.js and npm
- Access to the storefront specified by `BASE_URL`
- A test account that can sign in with email

## Setup

Install the project dependencies and Chromium:

```sh
npm install
npx playwright install chromium
```

Create a local `.env` file from the example:

```sh
cp .env.example .env
```

Set the following values in `.env`:

| Variable | Description |
| --- | --- |
| `BASE_URL` | Storefront origin, for example `https://your-store.example` |
| `TEST_EMAIL` | Email address for the test account |
| `TEST_PASSWORD` | Password for the test account |

Keep `.env` private; it is ignored by Git. Do not put real credentials in `.env.example`.

## Run tests

Run the complete suite:

```sh
npm test
```

Run one spec:

```sh
npm test -- tests/login.spec.js
npm test -- tests/product.spec.js
npm test -- tests/cart.spec.js
```

Run a spec with the browser visible:

```sh
npm run test:headed -- tests/cart.spec.js
```

The Playwright configuration captures screenshots on failure, records video, and collects a trace on the first retry. Open the HTML report after a run with:

```sh
npm run report
```

## Project layout

```text
pages/       Page objects and reusable page actions
tests/       Login, product, and cart specs
data/        Test data (when needed)
fixtures/    Shared Playwright fixtures (when needed)
utils/       Shared test helpers (when needed)
```
