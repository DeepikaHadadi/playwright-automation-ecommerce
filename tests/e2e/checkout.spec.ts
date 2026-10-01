import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { InventoryPage } from "../pages/inventory.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";
import { CheckoutStepTwoPage } from "../pages/checkout-step-two.page";
import { CheckoutCompletePage } from "../pages/checkout-complete.page";
import { takeScreenshot } from "../utils/take-screenshot";

test("e2e checkout product", async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  const checkoutCompletePage = new CheckoutCompletePage(page);
  const productName = "Sauce Labs Backpack";
  const productPrice = "$29.99";

  await loginPage.goto();
  await takeScreenshot(page, "01-login", testInfo);

  await loginPage.login("standard_user", "secret_sauce");
  await expect(page).toHaveURL(/inventory/);
  await takeScreenshot(page, "02-inventory", testInfo);

  await inventoryPage.addProductToCart(productName);
  await expect(inventoryPage.removeFromCartButton(productName)).toBeVisible();
  await expect(inventoryPage.cartBadge).toHaveText("1");

  await inventoryPage.openCart();
  await expect(page).toHaveURL(/cart/);
  await takeScreenshot(page, "03-cart", testInfo);
  await expect(cartPage.title).toHaveText("Your Cart");
  expect(await cartPage.getCartItemCount()).toBe(1);
  expect(await cartPage.hasProduct(productName)).toBe(true);
  await expect(cartPage.checkoutButton).toBeVisible();

  await cartPage.clickCheckout();
  await expect(page).toHaveURL(/checkout-step-one/);
  await expect(checkoutPage.title).toHaveText("Checkout: Your Information");
  await takeScreenshot(page, "04-checkout-step-one", testInfo);

  await checkoutPage.fillCheckoutInfo("John", "Doe", "12345");
  await checkoutPage.clickContinue();
  await expect(page).toHaveURL(/checkout-step-two/);
  await expect(checkoutStepTwoPage.title).toHaveText("Checkout: Overview");
  await takeScreenshot(page, "05-checkout-step-two", testInfo);

  expect(await checkoutStepTwoPage.hasProduct(productName)).toBe(true);
  expect(await checkoutStepTwoPage.getProductPrice(productName)).toBe(
    productPrice,
  );
  await expect(checkoutStepTwoPage.shippingInfoValue).toHaveText(
    "Free Pony Express Delivery!",
  );
  await expect(checkoutStepTwoPage.itemTotalLabel).toHaveText(
    `Item total: ${productPrice}`,
  );
  await expect(checkoutStepTwoPage.taxLabel).toHaveText("Tax: $2.40");
  await expect(checkoutStepTwoPage.totalLabel).toHaveText("Total: $32.39");

  await checkoutStepTwoPage.clickFinish();
  await expect(page).toHaveURL(/checkout-complete/);
  await expect(checkoutCompletePage.title).toHaveText("Checkout: Complete!");
  await takeScreenshot(page, "06-checkout-complete", testInfo);
  await expect(checkoutCompletePage.thankYouMessage).toHaveText(
    "Thank you for your order!",
  );
  await expect(checkoutCompletePage.backHomeButton).toBeVisible();
});
