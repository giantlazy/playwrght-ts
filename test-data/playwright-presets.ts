import type { BrowserContextOptions } from '@playwright/test';

/** Opt out of project `storageState` (fresh context for login flows). */
export const EMPTY_STORAGE_STATE = {
  cookies: [],
  origins: [],
} as const satisfies NonNullable<BrowserContextOptions['storageState']>;

export function absoluteAppUrl(baseURL: string, path: string): string {
  return new URL(path, baseURL).toString();
}

/**
 * Common `test.use` pairs for an app that uses global setup `storageState`.
 * Reuse for any origin — pass your `baseURL`.
 */
export function authTestUsePresets(baseURL: string) {
  return {
    withStoredAuth: { baseURL },
    withoutStoredAuth: {
      baseURL,
      storageState: EMPTY_STORAGE_STATE,
    },
  } as const;
}
