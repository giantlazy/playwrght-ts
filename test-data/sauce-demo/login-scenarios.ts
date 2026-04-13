import data from './login-scenarios.json';

/** Rows loaded from `login-scenarios.json` — keep valid credentials aligned with `sauceDemo.credentials`. */
export type SauceDemoLoginScenario = {
  name: string;
  username: string;
  password: string;
  outcome: 'success' | 'failure';
};

export const sauceDemoLoginScenarios = data as readonly SauceDemoLoginScenario[];
