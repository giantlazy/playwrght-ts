import { test as base } from '@playwright/test';
import { ApiClient } from '../api/api-client';
import { env } from '../config/env';

export type ApiFixtures = {
  api: ApiClient;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    await use(new ApiClient(request, env.apiBaseURL));
  },
});
