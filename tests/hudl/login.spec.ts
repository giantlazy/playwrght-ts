import { test, expect } from '@fixtures';
import { getHudlCredentialsFromEnv, hudl } from '@test-data';

/**
 * Hudl QA assessment — login at `https://www.hudl.com/login` (Universal Login).
 * Run: `npm run test:hudl`
 *
 * Happy path: only registered when credentials exist (`HUDL_EMAIL` / `HUDL_PASSWORD`
 * in `.env`, or `playwright/.secrets/hudl-login.json` — see `.env.example`). That
 * avoids a perpetually “skipped” row in the report when no secrets are configured.
 */
test.describe('Hudl / login', () => {
  test.beforeEach(async ({ hudlLoginPage }) => {
    await hudlLoginPage.goto(hudl.paths.login, { waitUntil: 'domcontentloaded' });
    await expect(hudlLoginPage.emailInput).toBeVisible();
  });

  const hudlCredentials = getHudlCredentialsFromEnv();
  if (hudlCredentials) {
    test('successful login with valid credentials', async ({
      page,
      hudlLoginPage,
    }) => {
      await hudlLoginPage.loginWithEmailAndPassword(
        hudlCredentials.email,
        hudlCredentials.password,
      );

      await expect(page).not.toHaveURL(hudl.patterns.identityHost);
      await expect(page).toHaveURL(/hudl\.com/i);
    });
  }

  test('identifier step rejects an invalid email format', async ({
    page,
    hudlLoginPage,
  }) => {
    await hudlLoginPage.submitIdentifier('notanemail');
    await expect(
      page.getByText(hudl.copy.emailInvalidFormat, { exact: true }),
    ).toBeVisible();
  });

  test('identifier step requires email when empty', async ({
    page,
    hudlLoginPage,
  }) => {
    await hudlLoginPage.emailInput.fill('');
    await hudlLoginPage.continueButton.click();
    await expect(
      page.getByText(hudl.copy.emailRequired, { exact: true }),
    ).toBeVisible();
  });

  test('password step shows error for incorrect password', async ({
    page,
    hudlLoginPage,
  }) => {
    const email = 'hudl-automation-invalid@example.com';
    await hudlLoginPage.submitIdentifier(email);
    await expect(hudlLoginPage.passwordInput).toBeVisible({ timeout: 30_000 });

    await hudlLoginPage.submitPassword('DefinitelyNotTheRightPassword123!');

    await expect(page).toHaveURL(/\/u\/login\/password/i);
    await expect(
      page.getByText(hudl.copy.incorrectCredentials, { exact: true }),
    ).toBeVisible();
  });

  test('password step blocks submit when password is empty (HTML5)', async ({
    hudlLoginPage,
  }) => {
    await hudlLoginPage.submitIdentifier('hudl-automation-empty-pass@example.com');
    await expect(hudlLoginPage.passwordInput).toBeVisible({ timeout: 30_000 });

    await hudlLoginPage.passwordInput.fill('');
    await hudlLoginPage.continueButton.click();

    await expect(hudlLoginPage.passwordInput).toHaveJSProperty(
      'validity.valueMissing',
      true,
    );
  });

  test('Forgot Password Navigates to Reset Flow', async ({
    page,
    hudlLoginPage,
  }) => {
    await hudlLoginPage.submitIdentifier('hudl-automation-forgot@example.com');
    await expect(hudlLoginPage.passwordInput).toBeVisible({ timeout: 30_000 });

    await hudlLoginPage.forgotPasswordLink.click();

    await expect(page).toHaveURL(hudl.patterns.resetPasswordPath);
    await expect(page).toHaveTitle(new RegExp(hudl.copy.resetPasswordTitle, 'i'));
  });
});
