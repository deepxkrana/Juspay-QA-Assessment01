class ProductPage {
  constructor(page) {
    this.page = page;
  }

  async openMetroKnit() {
    await this.page.goto('/products');
    await this.page.locator('a[href="/products/northline-metro-knit"]').click();
  }

  async addToCart() {
    await this.page.getByRole('button', { name: /add to cart/i }).click();
  }

  async viewCart() {
    await this.page.getByRole('link', { name: /view cart/i }).click();
  }
}

module.exports = ProductPage;