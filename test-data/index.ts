/** Shared static data; prefer small fixtures + factories as the suite grows. */
export const routes = {
  home: '/',
  login: '/login',
} as const;

export {
  EMPTY_STORAGE_STATE,
  absoluteAppUrl,
  authTestUsePresets,
} from './playwright-presets';
export {
  sauceDemo,
  sauceDemoAbsoluteUrl,
  sauceDemoLoginError,
  sauceDemoTestUse,
} from './sauce-demo';
export {
  sauceDemoLoginScenarios,
  type SauceDemoLoginScenario,
} from './sauce-demo/login-scenarios';
export {
  getHudlCredentialsFromEnv,
  hudl,
  hudlAbsoluteUrl,
  hudlTestUse,
  type HudlCredentials,
} from './hudl/hudl';
