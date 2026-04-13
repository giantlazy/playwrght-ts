import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly getStarted = this.page.getByRole('link', { name: 'Get started' });
  readonly installationHeading = this.page.getByRole('heading', {
    name: 'Installation',
  });
}
