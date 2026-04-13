import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from '@test-data';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  readonly emailInput: Locator = this.page.getByRole('textbox', {
    name: /email|username/i,
  });
  readonly passwordInput: Locator = this.page.getByRole('textbox', {
    name: /^password$/i,
  });
  readonly submitButton: Locator = this.page.getByRole('button', {
    name: /^(log\s*in|sign\s*in|login)$/i,
  });
  readonly errorAlert: Locator = this.page.getByRole('alert');

  override async goto(
    path: string = routes.login,
    options?: Parameters<Page['goto']>[1],
  ): Promise<void> {
    await super.goto(path, options);
  }

  /**
   * When `waitForPostLoginUrl` is set, navigation is awaited in parallel with the submit click.
   * That avoids races where the click resolves before the browser commits the next URL (common
   * source of flakiness on slower or third‑party hosts).
   */
  async login(
    email: string,
    password: string,
    options?: { waitForPostLoginUrl?: RegExp | string },
  ): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    if (options?.waitForPostLoginUrl !== undefined) {
      await Promise.all([
        this.page.waitForURL(options.waitForPostLoginUrl),
        this.submitButton.click(),
      ]);
    } else {
      await this.submitButton.click();
    }
  }
}
