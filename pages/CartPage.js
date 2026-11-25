class CartPage {
  constructor(page) {
    this.page = page;
  }

  product(name) {
    return this.page.getByText(name, { exact: true });
  }
}

module.exports = CartPage;