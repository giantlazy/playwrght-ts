import { test, expect } from '@fixtures';
import { routes } from '@test-data';
import { waitForPageReady } from '@utils';

test.describe('playwright.dev', () => {
  test('has title', async ({ page }) => {
    await page.goto(routes.home);
    await waitForPageReady(page);
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('get started link', async ({ homePage }) => {
    await homePage.goto(routes.home);
    await homePage.getStarted.click();
    await expect(homePage.installationHeading).toBeVisible();
  });
});
