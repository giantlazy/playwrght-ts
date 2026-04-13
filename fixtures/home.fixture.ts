import { test as base } from '@playwright/test';
import { HomePage } from '@pages/home.page';

export type HomePageFixtures = {
  homePage: HomePage;
};

export const test = base.extend<HomePageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});
