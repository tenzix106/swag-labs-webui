// tests/cart-and-checkout.spec.ts
import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { TestData } from '../fixtures/test-data';

const PRODUCT_ONE = 'Sauce Labs Backpack';
const PRODUCT_TWO = 'Sauce Labs Bike Light';

test.describe('Cart and checkout validations', () => {
  let context: BrowserContext;
  let page: Page;
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutInfoPage;
  let checkoutOverviewPage: CheckoutOverviewPage;

  test.beforeEach(async ({ browser }: { browser: Browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutInfoPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);

    await loginPage.goto(TestData.baseUrl);
    await loginPage.login(TestData.validUser.username, TestData.validUser.password);
    await inventoryPage.assertOnInventoryPage();
  });

  test('TC-CART-01: adding multiple items updates cart badge count correctly', async () => {
    try {
      await inventoryPage.addItemToCartByName(PRODUCT_ONE);
      await inventoryPage.addItemToCartByName(PRODUCT_TWO);
      await inventoryPage.assertCartBadgeCount(2);
    } catch (error) {
      await page.screenshot({ path: `test-results/cart-badge-${Date.now()}.png`, fullPage: true });
      throw error;
    } finally {
      await inventoryPage.logout();
      await page.close();
      await context.close();
    }
  });

  test('TC-CART-02: removing item from inventory page decrements cart badge', async () => {
    try {
      await inventoryPage.addItemToCartByName(PRODUCT_ONE);
      await inventoryPage.assertCartBadgeCount(1);
      await inventoryPage.removeItemFromCartByName(PRODUCT_ONE);
      await inventoryPage.assertCartBadgeCount(0);
    } catch (error) {
      await page.screenshot({ path: `test-results/cart-remove-${Date.now()}.png`, fullPage: true });
      throw error;
    } finally {
      await inventoryPage.logout();
      await page.close();
      await context.close();
    }
  });

  test('TC-CART-03: removing item from cart page updates item count', async () => {
    try {
      await inventoryPage.addItemToCartByName(PRODUCT_ONE);
      await inventoryPage.addItemToCartByName(PRODUCT_TWO);
      await inventoryPage.goToCart();
      await cartPage.assertOnCartPage();
      await cartPage.assertCartItemCount(2);
      await cartPage.removeItemByName(PRODUCT_ONE);
      await cartPage.assertCartItemCount(1);
    } catch (error) {
      await page.screenshot({ path: `test-results/cart-page-remove-${Date.now()}.png`, fullPage: true });
      throw error;
    } finally {
      await inventoryPage.logout();
      await page.close();
      await context.close();
    }
  });

  test('TC-CHK-01: checkout info step blocks continue when required fields are empty', async () => {
    try {
      await inventoryPage.addItemToCartByName(PRODUCT_ONE);
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutInfoPage.assertOnCheckoutInfoPage();
      await checkoutInfoPage.continueToOverview();
      await checkoutInfoPage.assertValidationError();
    } catch (error) {
      await page.screenshot({ path: `test-results/checkout-validation-${Date.now()}.png`, fullPage: true });
      throw error;
    } finally {
      await inventoryPage.logout();
      await page.close();
      await context.close();
    }
  });

  test('TC-CHK-02: canceling checkout info step returns user to cart page', async () => {
    try {
      await inventoryPage.addItemToCartByName(PRODUCT_ONE);
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutInfoPage.assertOnCheckoutInfoPage();
      await checkoutInfoPage.cancel();
      await cartPage.assertOnCartPage();
    } catch (error) {
      await page.screenshot({ path: `test-results/checkout-cancel-${Date.now()}.png`, fullPage: true });
      throw error;
    } finally {
      await inventoryPage.logout();
      await page.close();
      await context.close();
    }
  });

  test('TC-CHK-03: canceling checkout overview step returns user to inventory page', async () => {
    try {
      await inventoryPage.addItemToCartByName(PRODUCT_ONE);
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutInfoPage.fillCheckoutInfo(
        TestData.checkoutInfo.firstName,
        TestData.checkoutInfo.lastName,
        TestData.checkoutInfo.postalCode
      );
      await checkoutInfoPage.continueToOverview();
      await checkoutOverviewPage.assertOnOverviewPage();
      await checkoutOverviewPage.cancel();
      await inventoryPage.assertOnInventoryPage();
    } catch (error) {
      await page.screenshot({ path: `test-results/overview-cancel-${Date.now()}.png`, fullPage: true });
      throw error;
    } finally {
      await inventoryPage.logout();
      await page.close();
      await context.close();
    }
  });

  test.afterEach(async () => {
    if (page && !page.isClosed()) {
      await page.close();
    }
    if (context) {
      await context.close();
    }
  });
});