// pages/CheckoutOverviewPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutOverviewPage extends BasePage {
  readonly overviewContainer: Locator;
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.overviewContainer = page.getByTestId('checkout-summary-container');
    this.cartItems = page.getByTestId('cart-item');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish-button');
    this.cancelButton = page.getByTestId('cancel-button');
  }

  async assertOnOverviewPage(expectedUrlFragment = '/checkout-step-two'): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedUrlFragment));
    await expect(this.overviewContainer).toBeVisible();
  }

  async assertItemInSummary(itemName: string): Promise<void> {
    await expect(this.cartItems.filter({ hasText: itemName })).toBeVisible();
  }

  async getTotalPrice(): Promise<string> {
    return (await this.totalLabel.textContent()) ?? '';
  }

  async assertTotalEqualsSubtotalPlusTax(): Promise<void> {
    const subtotalText = (await this.subtotalLabel.textContent()) ?? '0';
    const taxText = (await this.taxLabel.textContent()) ?? '0';
    const totalText = (await this.totalLabel.textContent()) ?? '0';

    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));

    expect(total).toBeCloseTo(subtotal + tax, 2);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}