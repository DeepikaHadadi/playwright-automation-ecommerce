import { type Locator, type Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartItemQuantities: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(".title");
    this.cartItems = page.locator(".cart_item");
    this.cartItemNames = page.locator(".inventory_item_name");
    this.cartItemPrices = page.locator(".inventory_item_price");
    this.cartItemQuantities = page.locator(".cart_quantity");
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]',
    );
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async goto() {
    await this.page.goto("/cart.html");
  }

  /** Total number of items in the cart */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /** Names of all products in the cart */
  async getCartProductNames(): Promise<string[]> {
    return await this.cartItemNames.allTextContents();
  }

  /** Locator for a cart item by product name */
  cartItem(productName: string): Locator {
    return this.cartItems.filter({
      has: this.page.getByText(productName, { exact: true }),
    });
  }

  /** Whether a specific product is present in the cart */
  async hasProduct(productName: string): Promise<boolean> {
    return (await this.cartItem(productName).count()) > 0;
  }

  /** Quantity shown for a specific product */
  async getProductQuantity(productName: string): Promise<number> {
    const quantityText = await this.cartItem(productName)
      .locator(".cart_quantity")
      .textContent();
    return Number(quantityText);
  }

  /** Price shown for a specific product */
  async getProductPrice(productName: string): Promise<string> {
    const price =
      (await this.cartItem(productName)
        .locator(".inventory_item_price")
        .textContent()) ?? "";
    return price;
  }

  removeButton(productName: string): Locator {
    return this.cartItem(productName).locator("button", { hasText: "Remove" });
  }

  async removeProduct(productName: string) {
    await this.removeButton(productName).click();
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
