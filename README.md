# Playwright TypeScript — UI & API automation

This repository contains a **Playwright Test** suite in **TypeScript**, structured with the **Page Object Model**, shared **fixtures**, and environment-based configuration.

It includes a **Hudl login** flow (assessment-style) targeting `https://www.hudl.com/login`, implemented against Hudl’s **Universal Login** (Auth0) on `identity.hudl.com`, plus the original **Sauce Demo** examples.

---

## Presentation notes (for senior reviewers)

Use this section in walkthroughs or slide decks; point architects to **`FRAMEWORK-OVERVIEW.md`** for the full operating model.

### Scope and stack

| Topic | Detail |
| ----- | ------ |
| **Automation** | [Playwright Test](https://playwright.dev/) with TypeScript |
| **UI pattern** | **Page Object Model** (`pages/`) — locators and actions per screen |
| **Reuse** | **Fixtures** (`fixtures/`) merge page objects and API client into `test` |
| **Config** | **dotenv**-loaded env (`.env` + `.env.local`), multi-project Playwright config |
| **Quality** | **ESLint** (`npm run lint`), **TypeScript strict** (`npm run typecheck`) |
| **CI** | GitHub Actions installs browsers and runs the suite; HTML report artifact |

### Hudl assessment deliverable

| Item | Implementation |
| ---- | ---------------- |
| **Target** | `https://www.hudl.com/login` → Auth0 **identifier** then **password** on `identity.hudl.com` |
| **POM** | `pages/hudl-login.page.ts` — `HudlLoginPage` (separate from generic `LoginPage` used for Sauce Demo) |
| **Data / secrets** | `test-data/hudl/` — URLs, copy, patterns; **no credentials in Git** (env or gitignored JSON) |
| **Tests** | `tests/hudl/login.spec.ts` — positive path + validation + forgot-password (see table below) |
| **Isolation** | Playwright project **`hudl-chromium`** — own `baseURL`, empty storage; other projects **`testIgnore`** Hudl so Sauce Demo **setup** stays the single auth entry point for demo tests |

### Security and hygiene (Hudl / general)

- **`.env`**, **`.env.local`**, and **`playwright/.secrets/hudl-login.json`** are **not** committed; only **`.env.example`** and **`hudl-login.json.example`** are templates.
- **`playwright/.auth/user.json`** (Sauce Demo session) is generated per run and gitignored.
- Reviewers should use **Hudl-provided** test accounts only; do not invent production users.

### How to demo in five minutes

```bash
npm ci && npx playwright install --with-deps
cp .env.example .env   # add Hudl secrets locally if demonstrating happy path
npm run test:hudl      # Hudl-only, fast feedback
npm test               # full framework (ensure BASE_URL/API_BASE_URL match real hosts if set)
```

---

## Change log (recent enhancements)

High-level list of what was added or tightened for **Hudl** and **framework stability** (useful for PR descriptions or quarterly reviews).

| Area | Change |
| ---- | ------ |
| **Hudl module** | `tests/hudl/login.spec.ts`, `pages/hudl-login.page.ts`, `test-data/hudl/hudl.ts`, `test-data/hudl/credentials.ts` |
| **Fixtures** | `fixtures/hudl-login.fixture.ts`; merged in `fixtures/index.ts` |
| **Playwright projects** | `config/playwright.projects.ts` — `hudl-chromium` project + `testIgnore` on Sauce/browser projects for Hudl paths |
| **Credentials** | Multi-source resolution: env keys (incl. aliases), quoted values stripped, optional `playwright/.secrets/hudl-login.json` |
| **Env loading** | `config/load-env.ts` loads `.env` then `.env.local` |
| **Sauce Demo POM** | `pages/login.page.ts` — `getByRole('textbox', …)` instead of `getByLabel` so Sauce Demo login works when fields have no real `<label>` |
| **Tooling** | `eslint.config.mjs`, `npm run lint`; `package.json` script **`test:hudl`** |
| **Templates** | `.env.example`, `playwright/.secrets/hudl-login.json.example`; `.gitignore` entries for secrets |
| **Stakeholder doc** | Existing **`FRAMEWORK-OVERVIEW.md`** remains the deep-dive; this README is the onboarding + “what changed” surface |

### Repository map (quick)

| Path | Role |
| ---- | ---- |
| `tests/hudl/` | Hudl login scenarios |
| `tests/sauce-demo/` | Demo app + saved-session inventory |
| `tests/docs/`, `tests/api/` | Example UI + API client specs |
| `pages/` | Page objects (`LoginPage`, `HudlLoginPage`, …) |
| `fixtures/` | Composable `test` extensions |
| `config/` | Env, timeouts, Playwright projects |
| `test-data/` | Routes, presets, Hudl/Sauce constants |

---

## Prerequisites

- **Node.js** LTS (v18+ recommended)
- **npm** (ships with Node)

---

## Install

```bash
npm ci
npx playwright install --with-deps
```

`playwright install` downloads browser binaries required to run tests.

---

## Environment variables

1. Copy the example file and edit locally (this file is **not** committed with secrets):

   ```bash
   cp .env.example .env
   ```

   Optional: create **`.env.local`** for machine-only overrides (also gitignored). It is loaded after `.env`.

2. **Hudl credentials** (provided by Hudl in a separate email for the exercise):

   | Variable          | Purpose                                      |
   | ----------------- | -------------------------------------------- |
   | `HUDL_EMAIL`      | Test user email                              |
   | `HUDL_PASSWORD`   | Test user password                           |
   | `HUDL_TEST_EMAIL` / `HUDL_TEST_PASSWORD` | Aliases supported |
   | `HUDL_USERNAME`   | Alias for email                              |
   | `HUDL_BASE_URL`   | Optional; defaults to `https://www.hudl.com` |

   **Alternative:** copy `playwright/.secrets/hudl-login.json.example` to `playwright/.secrets/hudl-login.json` and fill `email` / `password` (the JSON file is gitignored).

   Never commit `.env` or real passwords. The repository already **gitignores** `.env`.

3. **General framework** variables (Sauce Demo, docs, API) are documented in `FRAMEWORK-OVERVIEW.md` (`BASE_URL`, `API_BASE_URL`, `TEST_ENV`, etc.).

---

## Run tests

| Command              | Description |
| -------------------- | ----------- |
| `npm test`           | Full suite (Sauce Demo setup + browser projects + Hudl project). |
| `npm run test:hudl`  | **Hudl login specs only**, Chromium, dedicated project (no Sauce Demo auth setup). |
| `npm run test:headed` | Full suite in headed mode. |
| `npm run test:ui`    | Playwright UI mode. |

Hudl project name: **`hudl-chromium`** (see `config/playwright.projects.ts`).

---

## Hudl scenarios (`tests/hudl/login.spec.ts`)

| Scenario | What it checks |
| -------- | -------------- |
| **Successful login** | Only runs when credentials are configured (`.env`, `.env.local`, or `playwright/.secrets/hudl-login.json`). Otherwise this case is **not listed** in the run (no “skipped” row). |
| **Invalid email format** | Identifier step shows “Enter a valid email.” |
| **Empty email** | Identifier step shows “Enter an email address”. |
| **Incorrect password** | Password step stays on Universal Login and shows “Incorrect username or password.” |
| **Empty password** | HTML5 `valueMissing` on the password field after Continue. |
| **Forgot Password** | Navigates to Auth0 reset URL and “Reset Password” title. |

---

## Quality checks

```bash
npm run typecheck
npm run lint
```

---

## Documentation

- **This `README.md`** — onboarding, **presentation notes**, **change log**, and Hudl scenario matrix.
- **`FRAMEWORK-OVERVIEW.md`** — architecture, fixtures, CI, and configuration for stakeholders.
- **Playwright** — [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)

---

## Push to your personal GitHub

1. **On GitHub:** create a **new empty repository** (no README, no `.gitignore`, no license) under your user, e.g. `playwright-ts`.
2. **On your machine** (from this project folder), if Git is not initialized yet:

   ```bash
   git init
   git branch -M main
   git add -A
   git status   # confirm `.env` and `node_modules/` are not listed
   git commit -m "Initial commit: Playwright TS framework with Hudl login suite"
   ```

3. **Add the remote** (replace `YOUR_USER` and `YOUR_REPO`):

   ```bash
   git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
   ```

   SSH example: `git@github.com:YOUR_USER/YOUR_REPO.git`

4. **Push:**

   ```bash
   git push -u origin main
   ```

After the first push, **GitHub Actions** (`.github/workflows/playwright.yml`) runs on pushes/PRs if Actions are enabled on the repo. For **Hudl** happy-path in CI, add **`HUDL_EMAIL`** and **`HUDL_PASSWORD`** as **repository secrets** and extend the workflow to pass them as env vars if you need that job to run the full Hudl suite in the cloud.

---

## CI

GitHub Actions workflow: `.github/workflows/playwright.yml` (install, run tests, upload HTML report).
