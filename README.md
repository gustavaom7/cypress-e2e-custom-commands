# 🧪 Advanced Quality Architecture - SauceDemo & API

![Cypress Tests](https://github.com/gustavaom7/testsArchitecture/actions/workflows/cypress.yml/badge.svg)
[![Quality](https://img.shields.io/badge/Quality-Assurance-orange)](https://github.com/gustavaom7/testsArchitecture)

Professional hybrid automation suite (GUI & API) developed with **Cypress** and **JavaScript**. This project demonstrates advanced automation patterns, performance optimization, and full integration with CI/CD pipelines.

---

## 🚀 Key Features & Engineering Patterns

### 🖥️ UI Automation (GUI)
* **Page Object Model (POM):** Scalable architecture for UI elements and actions.
* **Session Management:** Optimized login flow using `cy.session` to bypass repetitive UI login steps, reducing execution time by ~30%.
* **Custom Commands:** Encapsulated reusable logic for cleaner test scripts.
* **Known-Issue Tests:** SauceDemo's special users (`problem_user`, `error_user`, `performance_glitch_user`) are covered by tests that assert each deliberate defect exists (broken images, broken sorting, a checkout field that ignores input, a silent add-to-cart error, a slow login), so a silent fix upstream surfaces for re-triage.
* **Visual Regression:** Screenshot comparison of the login, inventory and cart pages with `cypress-image-diff-js`, plus a showcase test proving `visual_user`'s layout defects are caught against the `standard_user` baseline. Only baselines are versioned; diffs are git-ignored and kept as CI artifacts for 3 days, on failure only.
* **Accessibility Testing:** Automated a11y audits on the core pages (login, inventory, cart, checkout) via `cypress-axe`/axe-core.

### 🔌 API Automation (Backend)
* **Data-Driven Testing:** Dynamic test data generated with `@faker-js/faker` instead of hardcoded fixtures.
* **Contract Testing:** Schema validation to ensure API response integrity and data types.
* **Network Mocking:** `cy.intercept`-driven simulation of server errors, network failures and slow responses that a live third-party API can't reliably reproduce on demand.
* **Negative Scenarios:** Coverage for 404 errors, bad requests, and SLA performance validation.

### ⚡ Performance Testing
* **Load Testing (k6):** Smoke (1 VU, 30s) and load (ramp to 10 VUs) profiles against the API, with thresholds that fail the run: p95 < 800ms, < 1% failed requests, > 99% passing checks. Kept deliberately light because JSONPlaceholder is a shared public service — no stress/spike profiles.
* **Web Vitals (Lighthouse):** Performance, accessibility and best-practices audits of the login and inventory pages via `@cypress-audit/lighthouse`, reusing `cy.login`. Thresholds are intentionally loose (performance ≥ 60 against a ~68–70 baseline) since Lighthouse scores vary run to run.

### ⚙️ DevOps & CI/CD
* **GitHub Actions:** Lint gate, a fast smoke suite on every push/PR, and a full regression suite (parallelized across a job matrix) on every push to `main`.
* **Test Tagging:** Smoke vs. regression split via `@cypress/grep`.
* **Automated Reporting:** Rich HTML technical evidence generated via **Mochawesome**, merged across parallel shards and published even when tests fail.
* **Code Quality:** ESLint (`eslint-plugin-cypress`) + Prettier enforced in CI.

---

## 🏗️ Project Structure

```text
testsArchitecture/
├── .github/workflows/   # CI/CD Pipeline configuration
├── cypress/
│   ├── e2e/
│   │   ├── api/         # Backend contract, mocking and functional tests
│   │   └── gui/         # UI/Functional and accessibility tests (SauceDemo)
│   ├── visual/          # Visual regression spec and CI-generated baselines
│   ├── lighthouse/      # Lighthouse audits (outside e2e/, so regular suites skip them)
│   ├── fixtures/        # Test data in JSON format
│   └── support/         # Custom commands, dynamic test data and global config
├── performance/
│   ├── k6/              # k6 load tests (smoke/load profiles, shared scenarios)
│   └── reports/         # k6 JSON/HTML summaries (git-ignored)
├── cypress.config.js    # Cypress main configuration
└── package.json         # Scripts and dependencies
```

## 🚦 Local Execution
1. **Installation**

`npm install`


2. **Running Tests**

**Interactive Mode:** `npx cypress open`

**Full Suite (Headless, Chrome):** `npm run test:headless`

**Full Suite (Headed, Chrome):** `npm run test:headed`

**Only API Tests:** `npm run test:api`

**Only UI Tests:** `npm run test:gui`

**Smoke Suite Only:** `npm run test:smoke`

**Full Regression Suite:** `npm run test:regression`

3. **Performance Tests** (requires the [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) binary, e.g. `brew install k6`)

**k6 Smoke:** `npm run perf:smoke`

**k6 Load:** `npm run perf:load`

**Lighthouse (Chrome):** `npm run test:lighthouse`

**Visual Regression:** `npm run test:visual` (baselines come from CI; run the manual **Visual baselines** workflow, review the artifact and commit it to `cypress/visual/cypress-image-diff-screenshots/baseline/`. Locally, `npm run test:visual:update` regenerates them, but macOS renders fonts differently from CI, so don't commit local baselines)

k6 reports land in `performance/reports/` (`*-report.html` and `*-summary.json`).

4. **Code Quality**

**Lint:** `npm run lint` (`npm run lint:fix` to auto-fix)

**Format:** `npm run format`

## 📊 CI/CD Workflow
The automation runs on **Ubuntu-latest** via **GitHub Actions**, with four stages:

1. **Lint** — runs on every push/PR, gates everything else.
2. **Smoke** — a small set of critical happy-path tests, runs on every push/PR for fast feedback.
3. **Regression** — the full suite, split into parallel jobs by spec folder, runs on every push to `main`/`master`; a follow-up job merges every shard's report into one HTML report and publishes it, even if some tests failed.
4. **Performance** — k6 smoke on every push/PR; k6 load and Lighthouse audits only on pushes to `main`/`master`.
5. **Visual** — screenshot comparison on pushes to `main`/`master` (skipped until baselines are committed). CI artifacts use short retention (1–7 days) so reports don't pile up. Reports are uploaded as workflow artifacts.

[**📊 View Latest Automation Report**](https://gustavaom7.github.io/testsArchitecture/full-report.html)

## 👤 Author

**Gustavo** - QA Engineer

- [LinkedIn](https://www.linkedin.com/in/qa-gustavo-mesquita/)
- [GitHub](https://github.com/gustavaom7)

_Developed with ❤️ for quality assurance._
