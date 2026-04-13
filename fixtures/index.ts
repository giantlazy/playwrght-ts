import { mergeTests } from '@playwright/test';
import { test as apiTest } from './api.fixture';
import { test as homeTest } from './home.fixture';
import { test as hudlLoginTest } from './hudl-login.fixture';
import { test as loginTest } from './login.fixture';

export const test = mergeTests(apiTest, homeTest, loginTest, hudlLoginTest);
export { expect } from '@playwright/test';

export { test as apiTest, type ApiFixtures } from './api.fixture';
export { test as homeTest, type HomePageFixtures } from './home.fixture';
export {
  test as hudlLoginTest,
  type HudlLoginPageFixtures,
} from './hudl-login.fixture';
export { test as loginTest, type LoginPageFixtures } from './login.fixture';
