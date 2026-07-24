// pages/BasePage.ts
import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForUrlContains(fragment: string, timeout = 10000): Promise<void> {
    await this.page.waitForURL(new RegExp(fragment), { timeout });
  }

  async takeFailureScreenshot(testTitle: string): Promise<void> {
    const safeName = testTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    await this.page.screenshot({ path: `test-results/${safeName}-${Date.now()}.png`, fullPage: true });
  }
}