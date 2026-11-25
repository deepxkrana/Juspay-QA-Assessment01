export default class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  async addNewAddress() {
    await this.page.getByRole('button', { name: /add a new address/i }).click();
  }

  async fillAddress(address) {
    await this.page.getByLabel('Full name').fill(address.fullName);
    await this.page.getByLabel('Phone').fill(address.phone);
    await this.page.getByLabel('PIN code').fill(address.postalCode);
    await this.page.getByLabel('Address line 1').fill(address.addressLine1);
    await this.page.getByLabel('Address line 2 (optional)').fill(address.addressLine2);
    await this.page.getByLabel('City').fill(address.city);
    await this.page.getByLabel('State').fill(address.state);
    await this.page.getByLabel('Country').fill(address.country);
  }

  async useThisAddress() {
    await this.page.getByRole('button', { name: 'Use this address', exact: true }).click();
  }

  async placeOrder() {
    await this.page.getByRole('button', { name: 'Place order', exact: true }).click();
  }
}
