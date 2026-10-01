import { type Locator, type Page } from "@playwright/test";

export class CheckoutCompletePage {
  readonly page: Page;
  readonly title: Locator;
  readonly thankYouMessage: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(".title");
    this.thankYouMessage = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]');
  }

  async goto() {
    await this.page.goto("/checkout-complete.html");
  }

  async clickBackHome() {
    await this.backHomeButton.click();
  }
}
