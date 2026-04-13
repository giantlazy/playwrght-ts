import path from 'path';

/** Saved by auth setup; consumed by browser projects (path relative to config / cwd). */
export const AUTH_STORAGE_STATE = 'playwright/.auth/user.json';

export function authStorageStateAbsolute(): string {
  return path.join(process.cwd(), 'playwright', '.auth', 'user.json');
}
