import { test, expect } from '@fixtures';

test.describe('ApiClient', () => {
  test('GET resolves paths against API_BASE_URL / baseURL', async ({ api }) => {
    const res = await api.get('/');
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(500);
  });
});
