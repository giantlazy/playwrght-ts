import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login.page';

export type LoginPageFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<LoginPageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
