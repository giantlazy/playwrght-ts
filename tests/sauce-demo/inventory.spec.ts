import { test } from '@fixtures';
import { expectSauceDemoProductCatalog } from '@utils';
import { sauceDemo, sauceDemoTestUse } from '@test-data';

test.describe('Sauce Demo / inventory', () => {
  test.use(sauceDemoTestUse.withStoredAuth);

  test('uses saved session without logging in again', async ({ page }) => {
    await page.goto(sauceDemo.paths.inventory);
    await expectSauceDemoProductCatalog(page);
  });
});
