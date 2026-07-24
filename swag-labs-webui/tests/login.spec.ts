// tests/login.spec.ts
import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { TestData } from '../fixtures/test-data';

test.describe('Login flow', () => {
  let context: BrowserContext;
  let page: Page;
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ browser }: { browser: Browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
  });

  test.afterEach(async () => {
    // Single, guaranteed teardown point for every test in this suite
    await context.close();
  });

  test('TC-LOGIN-01: valid credentials land user on inventory page', async () => {
    await loginPage.goto(TestData.baseUrl);
    await loginPage.login(TestData.validUser.username, TestData.validUser.password);
    await inventoryPage.assertOnInventoryPage();
    await inventoryPage.logout();
    await loginPage.assertLoginFormVisible();
  });

  test('TC-LOGIN-02: invalid credentials show an error and block access', async () => {
    await loginPage.goto(TestData.baseUrl);
    await loginPage.login(TestData.invalidUser.username, TestData.invalidUser.password);
    await loginPage.assertErrorVisible("Epic sadface: Username and password do not match any user in this service");
    await expect(page).not.toHaveURL(/\/inventory\.html/);
  });

  test('TC-LOGIN-03: locked out user is denied access with an error message', async () => {
    await loginPage.goto(TestData.baseUrl);
    await loginPage.login(TestData.lockedUser.username, TestData.lockedUser.password);
    await loginPage.assertErrorVisible("Epic sadface: Sorry, this user has been locked out.");
  });

  test('TC-LOGIN-04: empty username and password fields show validation error', async () => {
    await loginPage.goto(TestData.baseUrl);
    await loginPage.login('', '');
    await loginPage.assertErrorVisible("Epic sadface: Username is required");
  });

  test('TC-LOGIN-05: empty password field show validation error', async () => {
    await loginPage.goto(TestData.baseUrl);
    await loginPage.login(TestData.validUser.username, '');
    await loginPage.assertErrorVisible("Epic sadface: Password is required");
  });
});