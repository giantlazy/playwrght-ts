import { mkdir } from 'fs/promises';
import path from 'path';
import { test as setup } from '@playwright/test';
import { authStorageStateAbsolute } from '@config/paths';
import { LoginPage } from '../pages/login.page';
import { sauceDemo, sauceDemoAbsoluteUrl } from '@test-data';

setup('save Sauce Demo session', async ({ page }) => {
  const authFile = authStorageStateAbsolute();
  await mkdir(path.dirname(authFile), { recursive: true });

  await page.goto(sauceDemoAbsoluteUrl(sauceDemo.paths.root), {
    waitUntil: 'domcontentloaded',
  });

  const loginPage = new LoginPage(page);
  await loginPage.login(
    sauceDemo.credentials.username,
    sauceDemo.credentials.password,
    { waitForPostLoginUrl: sauceDemo.patterns.inventoryUrl },
  );

  await page.context().storageState({ path: authFile });
});
