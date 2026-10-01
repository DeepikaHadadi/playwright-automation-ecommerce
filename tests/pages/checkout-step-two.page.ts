import { type Locator, type Page } from "@playwright/test";

export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly paymentInfoValue: Locator;
  readonly shippingInfoValue: Locator;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(".title");
    this.cartItems = page.locator(".cart_item");
    this.cartItemNames = page.locator(".inventory_item_name");
    this.cartItemPrices = page.locator(".inventory_item_price");
    this.paymentInfoValue = page.locator('[data-test="payment-info-value"]');
    this.shippingInfoValue = page.locator('[data-test="shipping-info-value"]');
    this.itemTotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async goto() {
    await this.page.goto("/checkout-step-two.html");
  }

  cartItem(productName: string): Locator {
    return this.cartItems.filter({
      has: this.page.getByText(productName, { exact: true }),
    });
  }

  async hasProduct(productName: string): Promise<boolean> {
    return (await this.cartItem(productName).count()) > 0;
  }

  async getProductPrice(productName: string): Promise<string> {
    return (
      (await this.cartItem(productName)
        .locator(".inventory_item_price")
        .textContent()) ?? ""
    );
  }

  async getProductNames(): Promise<string[]> {
    return await this.cartItemNames.allTextContents();
  }

  async getItemTotalText(): Promise<string> {
    return (await this.itemTotalLabel.textContent()) ?? "";
  }

  async getTaxText(): Promise<string> {
    return (await this.taxLabel.textContent()) ?? "";
  }

  async getTotalText(): Promise<string> {
    return (await this.totalLabel.textContent()) ?? "";
  }

  async getShippingInfo(): Promise<string> {
    return (await this.shippingInfoValue.textContent()) ?? "";
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }
}
