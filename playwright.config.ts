import './config/load-env';
import { defineConfig } from '@playwright/test';
import { createProjects, env, timeouts } from './config';

/**
 * @see https://playwright.dev/docs/test-configuration
 *
 * `.env` is loaded via `import './config/load-env'` (see `config/load-env.ts`).
 * Profiles: `config/environments.ts` — override with `TEST_ENV`, `BASE_URL`, `API_BASE_URL`, `RETRIES`.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: env.retries,
  workers: process.env.CI ? 1 : undefined,

  expect: {
    timeout: timeouts.expectDefault,
  },

  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: process.env.CI ? 'never' : 'on-failure',
      },
    ],
  ],

  metadata: {
    'test-env': env.name,
    baseURL: env.baseURL,
    apiBaseURL: env.apiBaseURL,
  },

  use: {
    baseURL: env.baseURL,
    navigationTimeout: timeouts.navigation,
    trace: 'on-first-retry',
  },

  projects: createProjects(),
});
