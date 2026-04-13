import { devices, type PlaywrightTestProject } from '@playwright/test';
import { AUTH_STORAGE_STATE } from './paths';
import { EMPTY_STORAGE_STATE } from '@test-data';

const hudlBaseURL =
  process.env.HUDL_BASE_URL?.trim() || 'https://www.hudl.com';

const desktopBrowsers = [
  { name: 'chromium' as const, device: devices['Desktop Chrome'] },
  { name: 'firefox' as const, device: devices['Desktop Firefox'] },
  { name: 'webkit' as const, device: devices['Desktop Safari'] },
];

export function createProjects(): PlaywrightTestProject[] {
  return [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    /**
     * Hudl login lives on Auth0 (`identity.hudl.com`) after `www.hudl.com/login`.
     * Separate project: no Sauce Demo setup, fresh storage, stable `baseURL`.
     */
    {
      name: 'hudl-chromium',
      testMatch: '**/hudl/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: hudlBaseURL,
        storageState: EMPTY_STORAGE_STATE,
      },
    },
    ...desktopBrowsers.map(
      ({ name, device }): PlaywrightTestProject => ({
        name,
        dependencies: ['setup'],
        testIgnore: '**/hudl/**',
        use: {
          ...device,
          storageState: AUTH_STORAGE_STATE,
        },
      }),
    ),
  ];
}
