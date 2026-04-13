import { test as base } from '@playwright/test';
import { HudlLoginPage } from '@pages/hudl-login.page';

export type HudlLoginPageFixtures = {
  hudlLoginPage: HudlLoginPage;
};

export const test = base.extend<HudlLoginPageFixtures>({
  hudlLoginPage: async ({ page }, use) => {
    await use(new HudlLoginPage(page));
  },
});
