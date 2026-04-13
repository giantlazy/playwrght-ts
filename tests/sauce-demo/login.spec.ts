import { test, expect } from '@fixtures';
import { expectSauceDemoProductCatalog } from '@utils';
import {
  sauceDemo,
  sauceDemoLoginError,
  sauceDemoLoginScenarios,
  sauceDemoTestUse,
} from '@test-data';

test.describe('Sauce Demo / login', () => {
  test.use(sauceDemoTestUse.withoutStoredAuth);

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto(sauceDemo.paths.root, { waitUntil: 'domcontentloaded' });
  });

  for (const row of sauceDemoLoginScenarios) {
    test(row.name, async ({ page, loginPage }) => {
      if (row.outcome === 'success') {
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.submitButton).toBeEnabled();

        await loginPage.login(row.username, row.password, {
          waitForPostLoginUrl: sauceDemo.patterns.inventoryUrl,
        });

        await expect(page).toHaveURL(sauceDemo.patterns.inventoryUrl);
        await expectSauceDemoProductCatalog(page);
      } else {
        await loginPage.login(row.username, row.password);
        await expect(page).toHaveURL(sauceDemo.patterns.siteRootUrl);
        await expect(page.getByText(sauceDemoLoginError)).toBeVisible();
      }
    });
  }
});
