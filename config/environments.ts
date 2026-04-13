export type EnvironmentName = 'default' | 'local' | 'staging' | 'production';

type Profile = Readonly<{
  baseURL: string;
  /** Applied when RETRIES is unset and CI is not set */
  retriesLocal?: number;
}>;

/**
 * Default URLs are placeholders except `default`, which matches the starter example app.
 * Override with BASE_URL, or edit profiles to match your deployments.
 */
export const environments: Record<EnvironmentName, Profile> = {
  default: {
    baseURL: 'https://playwright.dev',
  },
  local: {
    baseURL: 'http://localhost:3000',
  },
  staging: {
    baseURL: 'https://staging.example.com',
    retriesLocal: 1,
  },
  production: {
    baseURL: 'https://www.example.com',
  },
};

function normalizeEnv(value: string | undefined): EnvironmentName {
  const v = (value ?? '').toLowerCase().trim();
  if (v === 'prod') return 'production';
  if (
    v === 'default' ||
    v === 'local' ||
    v === 'staging' ||
    v === 'production'
  ) {
    return v;
  }
  return 'default';
}

export function getActiveEnvironmentName(): EnvironmentName {
  return normalizeEnv(process.env.TEST_ENV ?? process.env.ENV);
}

export function resolveBaseURL(envName: EnvironmentName): string {
  const fromEnv = process.env.BASE_URL?.trim();
  if (fromEnv) return fromEnv;
  return environments[envName].baseURL;
}

export function resolveRetryCount(envName: EnvironmentName): number {
  const raw = process.env.RETRIES?.trim();
  if (raw !== undefined && raw !== '') {
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  if (process.env.CI) return 2;
  return environments[envName].retriesLocal ?? 0;
}
