import { type Locator, type Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(".title");
    this.productItems = page.locator(".inventory_item");
    this.productNames = page.locator(".inventory_item_name");
    this.productPrices = page.locator(".inventory_item_price");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator(".shopping_cart_link");
    this.cartBadge = page.locator(".shopping_cart_badge");
  }

  async goto() {
    await this.page.goto("/inventory.html");
  }

  /** Total number of products on the inventory page */
  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  /** Names of all products displayed */
  async getProductNames(): Promise<string[]> {
    return await this.productNames.allTextContents();
  }

  /** Prices of all products displayed */
  async getProductPrices(): Promise<string[]> {
    return await this.productPrices.allTextContents();
  }

  /** Locator for a product card by its display name */
  productItem(productName: string): Locator {
    return this.productItems.filter({
      has: this.page.getByText(productName, { exact: true }),
    });
  }

  /** Add to cart button for a specific product */
  addToCartButton(productName: string): Locator {
    return this.productItem(productName).locator("button", {
      hasText: "Add to cart",
    });
  }

  /** Remove from cart button for a specific product */
  removeFromCartButton(productName: string): Locator {
    return this.productItem(productName).locator("button", {
      hasText: "Remove",
    });
  }

  async addProductToCart(productName: string) {
    await this.addToCartButton(productName).click();
  }

  async removeProductFromCart(productName: string) {
    await this.removeFromCartButton(productName).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async getCartBadgeCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) {
      return 0;
    }
    return Number(await this.cartBadge.textContent());
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo") {
    await this.sortDropdown.selectOption(option);
  }
}
