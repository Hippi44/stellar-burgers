import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const harDir = path.resolve(__dirname, 'hars');

const readHarResponse = (harFile: string): string => {
  const har = JSON.parse(fs.readFileSync(path.join(harDir, harFile), 'utf-8'));
  return har.log.entries[0].response.content.text;
};

const API_URL = 'https://norma.education-services.ru/api';

test.describe('Constructor Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API_URL}/ingredients`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: readHarResponse('ingredients.har')
      })
    );

    await page.route(`${API_URL}/auth/user`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: readHarResponse('user.har')
      })
    );

    await page.route(`${API_URL}/orders`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: readHarResponse('order.har')
      })
    );

    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('should add ingredient from list to constructor', async ({ page }) => {
    const addButtons = page.locator('button:has-text("Добавить")');
    await expect(addButtons.first()).toBeVisible();
    await addButtons.first().click();

    const constructorElements = page.locator(
      '[class*="constructor"] [class*="element"]'
    );
    await expect(constructorElements).not.toHaveCount(0);
  });

  test('should open and close ingredient modal', async ({ page }) => {
    const ingredient = page.locator('a[href*="/ingredients/"]').first();
    await expect(ingredient).toBeVisible();
    await ingredient.click();

    const modal = page.locator('#modals > div').first();
    await expect(modal).toBeVisible();

    const closeButton = modal.locator('button');
    await closeButton.click();
    await expect(page.locator('#modals')).toBeEmpty();
  });

  test('should display correct ingredient data in modal', async ({ page }) => {
    const ingredient = page.locator('a[href*="/ingredients/"]').first();
    await ingredient.click();

    const modal = page.locator('#modals > div').first();
    await expect(modal).toBeVisible();
    const modalTitle = await modal.locator('h3').first().textContent();
    expect(modalTitle).toContain('Детали ингредиента');
  });

  test('should create order and display order number, then clear constructor', async ({
    page
  }) => {
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer fake-token',
        domain: 'localhost',
        path: '/'
      }
    ]);
    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.goto('/');

    const addButtons = page.locator('button:has-text("Добавить")');
    await addButtons.first().click();
    await addButtons.nth(2).click();

    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await expect(orderButton).toBeEnabled();
    await orderButton.click();

    const orderModal = page.locator('#modals > div').first();
    await expect(orderModal).toBeVisible();
    await expect(orderModal).toContainText('12345');

    const closeButton = orderModal.locator('button');
    await closeButton.click();
    await expect(page.locator('#modals')).toBeEmpty();

    const constructorText = page.locator('section').last();
    await expect(constructorText).toContainText('Выберите булки');
  });

  test('should close modal by clicking overlay', async ({ page }) => {
    const ingredient = page.locator('a[href*="/ingredients/"]').first();
    await ingredient.click();

    const modal = page.locator('#modals > div').first();
    await expect(modal).toBeVisible();

    const overlay = page.locator('#modals > div').last();
    await overlay.click({ position: { x: 10, y: 10 } });
    await expect(page.locator('#modals')).toBeEmpty();
  });
});
