import fs from 'fs';
import path from 'path';

export type HudlCredentials = Readonly<{
  email: string;
  password: string;
}>;

function stripQuotes(value: string): string {
  const t = value.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1).trim();
  }
  return t;
}

function firstNonEmpty(
  keys: readonly string[],
): { key: string; value: string } | null {
  for (const key of keys) {
    const raw = process.env[key];
    if (raw === undefined || raw === null) continue;
    const value = stripQuotes(raw);
    if (value !== '') return { key, value };
  }
  return null;
}

function readOptionalSecretsFile(): HudlCredentials | null {
  const file = path.join(
    process.cwd(),
    'playwright',
    '.secrets',
    'hudl-login.json',
  );
  if (!fs.existsSync(file)) return null;
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'email' in parsed &&
      'password' in parsed &&
      typeof (parsed as { email: unknown }).email === 'string' &&
      typeof (parsed as { password: unknown }).password === 'string'
    ) {
      const email = stripQuotes((parsed as { email: string }).email);
      const password = stripQuotes((parsed as { password: string }).password);
      if (email && password) return { email, password };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Resolves Hudl test credentials without ever hardcoding them in the repo.
 *
 * Precedence: environment variables → `playwright/.secrets/hudl-login.json`.
 *
 * Supported env keys (first non-empty wins per field):
 * - Email: `HUDL_EMAIL`, `HUDL_TEST_EMAIL`, `HUDL_USERNAME`
 * - Password: `HUDL_PASSWORD`, `HUDL_TEST_PASSWORD`
 */
export function getHudlCredentialsFromEnv(): HudlCredentials | null {
  const emailEntry = firstNonEmpty([
    'HUDL_EMAIL',
    'HUDL_TEST_EMAIL',
    'HUDL_USERNAME',
  ]);
  const passwordEntry = firstNonEmpty([
    'HUDL_PASSWORD',
    'HUDL_TEST_PASSWORD',
  ]);
  if (emailEntry && passwordEntry) {
    return { email: emailEntry.value, password: passwordEntry.value };
  }

  return readOptionalSecretsFile();
}
