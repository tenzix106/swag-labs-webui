// pages/CartPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartContainer: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartContainer = page.getByTestId('cart-container');
    this.cartItems = page.getByTestId('cart-item');
    this.checkoutButton = page.getByTestId('checkout-button');
    this.continueShoppingButton = page.getByTestId('continue-shopping-button');
  }

  async assertOnCartPage(expectedUrlFragment = '/cart'): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedUrlFragment));
    await expect(this.cartContainer).toBeVisible();
  }

  async assertItemInCart(itemName: string): Promise<void> {
    await expect(this.cartItems.filter({ hasText: itemName })).toBeVisible();
  }

  async assertCartItemCount(expectedCount: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async removeItemByName(itemName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: itemName });
    await item.getByTestId('remove-from-cart-button').click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}