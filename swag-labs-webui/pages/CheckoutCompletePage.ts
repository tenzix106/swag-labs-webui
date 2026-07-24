// pages/CheckoutCompletePage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products-button');
  }

  async assertOnCompletePage(expectedUrlFragment = '/checkout-complete'): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedUrlFragment));
    await expect(this.completeHeader).toBeVisible();
  }

  async assertOrderConfirmed(expectedHeaderText = /thank you/i): Promise<void> {
    await expect(this.completeHeader).toHaveText(expectedHeaderText);
    await expect(this.completeText).toBeVisible();
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}