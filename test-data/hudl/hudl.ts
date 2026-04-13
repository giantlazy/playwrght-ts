import { authTestUsePresets, absoluteAppUrl } from '../playwright-presets';

const BASE_URL = 'https://www.hudl.com';

/**
 * Hudl assessment target: `https://www.hudl.com/login` → Universal Login (Auth0) on
 * `identity.hudl.com` (identifier step, then password).
 */
export const hudl = {
  baseURL: BASE_URL,
  paths: {
    login: '/login',
  },
  copy: {
    incorrectCredentials: 'Incorrect username or password.',
    emailRequired: 'Enter an email address',
    emailInvalidFormat: 'Enter a valid email.',
    resetPasswordTitle: 'Reset Password',
  },
  patterns: {
    identityHost: /identity\.hudl\.com/,
    resetPasswordPath: /\/u\/reset-password\//,
  },
} as const;

export const hudlTestUse = authTestUsePresets(hudl.baseURL);

export function hudlAbsoluteUrl(relativePath: string): string {
  return absoluteAppUrl(hudl.baseURL, relativePath);
}

export type { HudlCredentials } from './credentials';
export { getHudlCredentialsFromEnv } from './credentials';
