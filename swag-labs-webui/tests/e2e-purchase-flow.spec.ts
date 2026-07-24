// tests/e2e-purchase-flow.spec.ts
import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { TestData } from '../fixtures/test-data';

const PRODUCT_NAME = 'Sauce Labs Backpack';

test.describe('End-to-end purchase flow', () => {
  let context: BrowserContext;
  let page: Page;
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutInfoPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let checkoutCompletePage: CheckoutCompletePage;

  test.beforeEach(async ({ browser }: { browser: Browser }) => {
    // Step 1: Create an isolated browser context and page per test
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutInfoPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);
  });

  test('TC-E2E-01: user completes full purchase flow from login to order confirmation', async ({}, testInfo) => {
    try {
      // Step 1: Navigate to login page and authenticate
      await loginPage.goto(TestData.baseUrl);
      await loginPage.login(TestData.validUser.username, TestData.validUser.password);

      // Step 2: Verify successful landing on inventory page
      await inventoryPage.assertOnInventoryPage();

      // Step 3: Add a product to the cart and verify badge count
      await inventoryPage.addItemToCartByName(PRODUCT_NAME);
      await inventoryPage.assertCartBadgeCount(1);

      // Step 4: Navigate to cart and verify item is present
      await inventoryPage.goToCart();
      await cartPage.assertOnCartPage();
      await cartPage.assertItemInCart(PRODUCT_NAME);

      // Step 5: Proceed to checkout information step
      await cartPage.proceedToCheckout();
      await checkoutInfoPage.assertOnCheckoutInfoPage();

      // Step 6: Fill in checkout information and continue
      await checkoutInfoPage.fillCheckoutInfo(
        TestData.checkoutInfo.firstName,
        TestData.checkoutInfo.lastName,
        TestData.checkoutInfo.postalCode
      );
      await checkoutInfoPage.continueToOverview();

      // Step 7: Verify order overview details and pricing
      await checkoutOverviewPage.assertOnOverviewPage();
      await checkoutOverviewPage.assertItemInSummary(PRODUCT_NAME);
      await checkoutOverviewPage.assertTotalEqualsSubtotalPlusTax();

      // Step 8: Finish the order
      await checkoutOverviewPage.finish();

      // Step 9: Verify order completion confirmation
      await checkoutCompletePage.assertOnCompletePage();
      await checkoutCompletePage.assertOrderConfirmed();

      // Step 10: Return to inventory and log out to close the session properly
      await checkoutCompletePage.backToProducts();
      await inventoryPage.assertOnInventoryPage();
      await inventoryPage.logout();
      await loginPage.assertLoginFormVisible();
    } catch (error) {
      // Capture screenshot for debugging before rethrowing the failure
      await page.screenshot({ path: `test-results/${testInfo.title.replace(/\s+/g, '_')}.png`, fullPage: true });
      throw error;
    } finally {
      // Always release browser resources regardless of outcome
      await page.close();
      await context.close();
    }
  });

  test.afterEach(async () => {
    // Safety net cleanup in case context/page remains open after a failure
    if (page && !page.isClosed()) {
      await page.close();
    }
    if (context) {
      await context.close();
    }
  });
});