// pages/InventoryPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly inventoryContainer: Locator;
  readonly pageTitle: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItem: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.pageTitle = page.locator('[data-test="title"]')
    this.menuButton = page.locator('#menu_button_container').locator('#react-burger-menu-btn')
    this.logoutLink = page.getByText("Logout");
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]')
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]')
    this.sortDropdown = page.locator('[data-test="product-sort-container"]')
    this.inventoryItem = page.getByTestId('inventory-item')
  }

  async assertOnInventoryPage(expectedUrlFragment = '/inventory.html'): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedUrlFragment));
    await expect(this.inventoryContainer).toBeVisible();
    await expect(this.pageTitle).toHaveText("Products");
  }

  async addItemToCartByName(itemName: string): Promise<void> {
    const item = this.inventoryItem.filter({ hasText: itemName });
    await item.getByTestId('add-to-cart-button').click();
  }

  async removeItemFromCartByName(itemName: string): Promise<void> {
    const item = this.inventoryItem.filter({ hasText: itemName });
    await item.getByTestId('remove-from-cart-button').click();
  }

  async assertCartBadgeCount(expectedCount: number): Promise<void> {
    if (expectedCount === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toHaveText(String(expectedCount));
    }
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
  }
}