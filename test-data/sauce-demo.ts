import { authTestUsePresets, absoluteAppUrl } from './playwright-presets';

const BASE_URL = 'https://www.saucedemo.com';

/**
 * Sauce Demo — app-specific paths, copy, credentials, and URL assertions.
 * `sauceDemoTestUse` comes from shared `authTestUsePresets` (see `playwright-presets.ts`).
 */
export const sauceDemo = {
  baseURL: BASE_URL,
  paths: {
    root: '/',
    inventory: '/inventory.html',
  },
  copy: {
    productsHeading: 'Products',
  },
  credentials: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  patterns: {
    inventoryUrl: /\/inventory\.html$/,
    siteRootUrl: /\/$/,
  },
} as const;

export const sauceDemoLoginError =
  /Username and password do not match any user in this service/i;

export const sauceDemoTestUse = authTestUsePresets(sauceDemo.baseURL);

export function sauceDemoAbsoluteUrl(relativePath: string): string {
  return absoluteAppUrl(sauceDemo.baseURL, relativePath);
}
