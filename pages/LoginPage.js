class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('/');
    await this.page.goto('/login');
  }
}

module.exports = LoginPage;