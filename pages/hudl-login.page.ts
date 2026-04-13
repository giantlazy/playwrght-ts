import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { hudl } from '@test-data/hudl/hudl';

/**
 * Page object for Hudl’s Universal Login flow (email identifier → password).
 * Entry URL per assessment: {@link hudl.paths.login} on `www.hudl.com`.
 */
export class HudlLoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Identifier (“Email”) step on `identity.hudl.com/u/login/identifier`. */
  readonly emailInput: Locator = this.page.locator('#username');

  /** Password step on `identity.hudl.com/u/login/password`. */
  readonly passwordInput: Locator = this.page.locator('#password');

  /**
   * Primary “Continue” on the active step (email or password). Social buttons are
   * named distinctly (e.g. “Continue with Google”).
   */
  readonly continueButton: Locator = this.page.getByRole('button', {
    name: /^Continue$/i,
  });

  readonly forgotPasswordLink: Locator = this.page.getByRole('link', {
    name: /forgot password/i,
  });

  override async goto(
    path: string = hudl.paths.login,
    options?: Parameters<Page['goto']>[1],
  ): Promise<void> {
    await super.goto(path, options);
  }

  async submitIdentifier(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.continueButton.click();
  }

  async submitPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.continueButton.click();
  }

  /**
   * Full happy-path submit. Waits until navigation leaves Universal Login, which
   * covers redirects to `www.hudl.com` or product subdomains.
   */
  async loginWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<void> {
    await this.submitIdentifier(email);
    await this.passwordInput.waitFor({ state: 'visible', timeout: 30_000 });
    await Promise.all([
      this.page.waitForURL(
        (url) => url.hostname !== 'identity.hudl.com',
        { timeout: 60_000 },
      ),
      this.submitPassword(password),
    ]);
  }
}
