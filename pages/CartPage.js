class CartPage {
  constructor(page) {
    this.page = page;
  }

  product(name) {
    return this.page.getByText(name, { exact: true });
  }

  async checkout() {
    await this.page.getByRole('link', { name: /^checkout$/i }).click();
  }
}

module.exports = CartPage;