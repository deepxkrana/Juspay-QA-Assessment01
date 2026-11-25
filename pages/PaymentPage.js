export default class PaymentPage {
  constructor(page) {
    this.page = page;
  }

  async fillCardDetails(details) {
    await this.page.getByLabel('Name on card').fill(details.cardholderName);
    await this.page.getByLabel('Card number').fill(details.cardNumber);
    await this.page.getByLabel('Expiry date').fill(details.expiryDate);
    await this.page.getByLabel('CVV / Security code').fill(details.securityCode);
  }

  async proceedToOtp() {
    await this.page.getByRole('button', { name: 'Proceed to OTP', exact: true }).click();
  }

  async fillOtp(otp) {
    await this.page.locator('input[autocomplete="one-time-code"]').fill(otp);
  }

  async verifyAndPay() {
    await this.page.getByRole('button', { name: /^Verify & Pay\b/ }).click();
  }
}
