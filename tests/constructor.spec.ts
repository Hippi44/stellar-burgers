import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const harDir = path.resolve(__dirname, 'hars');

const readHarJson = (harFile: string) => {
  const har = JSON.parse(fs.readFileSync(path.join(harDir, harFile), 'utf-8'));
  return JSON.parse(har.log.entries[0].response.content.text);
};

const API_URL = 'https://norma.education-services.ru/api';

test.describe('Constructor Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(path.join(harDir, 'ingredients.har'), {
      url: `${API_URL}/ingredients`,
      update: false
    });

    await page.routeFromHAR(path.join(harDir, 'user.har'), {
      url: `${API_URL}/auth/user`,
      update: false
    });

    await page.routeFromHAR(path.join(harDir, 'order.har'), {
      url: `${API_URL}/orders`,
      update: false
    });

    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('should add specific ingredient from list to constructor', async ({
    page
  }) => {
    const ingredients = readHarJson('ingredients.har').data;
    const target = ingredients[2];

    const card = page.locator(`a[href*="/ingredients/${target._id}"]`);
    await expect(card).toBeVisible();
    await card.locator('~ button').click();

    const constructorSection = page.locator('section').last();
    await expect(constructorSection).toContainText(target.name);
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
    const ingredients = readHarJson('ingredients.har').data;
    const target = ingredients[2];

    const card = page.locator(`a[href*="/ingredients/${target._id}"]`);
    await card.click();

    const modal = page.locator('#modals > div').first();
    await expect(modal).toBeVisible();

    await expect(modal.locator('h3')).toContainText(target.name);
    await expect(modal).toContainText(target.calories.toString());
    await expect(modal).toContainText(target.proteins.toString());
    await expect(modal).toContainText(target.fat.toString());
    await expect(modal).toContainText(target.carbohydrates.toString());
  });

  test('should create order and display order number, then clear constructor', async ({
    page
  }) => {
    const orderData = readHarJson('order.har');
    const expectedOrderNumber = orderData.order.number;

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

    const ingredients = readHarJson('ingredients.har').data;
    const bun = ingredients.find((i: { type: string }) => i.type === 'bun');
    const filling = ingredients.find(
      (i: { type: string }) => i.type === 'main'
    );

    await page
      .locator(`a[href*="/ingredients/${bun._id}"]`)
      .locator('~ button')
      .click();
    await page
      .locator(`a[href*="/ingredients/${filling._id}"]`)
      .locator('~ button')
      .click();

    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await expect(orderButton).toBeEnabled();
    await orderButton.click();

    const orderModal = page.locator('#modals > div').first();
    await expect(orderModal).toBeVisible();
    await expect(orderModal).toContainText(expectedOrderNumber.toString());

    const closeButton = orderModal.locator('button');
    await closeButton.click();
    await expect(page.locator('#modals')).toBeEmpty();

    const constructorSection = page.locator('section').last();
    await expect(constructorSection).toContainText('Выберите булки');
    await expect(constructorSection).toContainText('Выберите начинку');
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
