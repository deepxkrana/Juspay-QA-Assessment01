class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async openHome() {
    await this.page.goto('/');
  }

  async openLogin() {
    await this.page.goto('/login');
  }

  async open() {
    await this.openHome();
    await this.openLogin();
  }
}

module.exports = LoginPage;