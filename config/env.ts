import './load-env';
import {
  getActiveEnvironmentName,
  resolveBaseURL,
  resolveRetryCount,
  type EnvironmentName,
} from './environments';

const name: EnvironmentName = getActiveEnvironmentName();
const baseURL = resolveBaseURL(name);

export const env = {
  name,
  baseURL,
  /** Override with `API_BASE_URL` when the API host differs from the UI `baseURL`. */
  apiBaseURL: process.env.API_BASE_URL?.trim() || baseURL,
  retries: resolveRetryCount(name),
} as const;
