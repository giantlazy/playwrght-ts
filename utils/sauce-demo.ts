import { expect, type Page } from '@playwright/test';
import { sauceDemo } from '@test-data';

export async function expectSauceDemoProductCatalog(page: Page): Promise<void> {
  await expect(
    page.getByRole('heading', { name: sauceDemo.copy.productsHeading }),
  ).toBeVisible();
}
