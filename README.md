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
* **Accessibility Testing:** Automated a11y audits on the core pages (login, inventory, cart, checkout) via `cypress-axe`/axe-core.

### 🔌 API Automation (Backend)
* **Data-Driven Testing:** Dynamic test data generated with `@faker-js/faker` instead of hardcoded fixtures.
* **Contract Testing:** Schema validation to ensure API response integrity and data types.
* **Network Mocking:** `cy.intercept`-driven simulation of server errors, network failures and slow responses that a live third-party API can't reliably reproduce on demand.
* **Negative Scenarios:** Coverage for 404 errors, bad requests, and SLA performance validation.

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
│   ├── fixtures/        # Test data in JSON format
│   └── support/         # Custom commands, dynamic test data and global config
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

3. **Code Quality**

**Lint:** `npm run lint` (`npm run lint:fix` to auto-fix)

**Format:** `npm run format`

## 📊 CI/CD Workflow
The automation runs on **Ubuntu-latest** via **GitHub Actions**, with three stages:

1. **Lint** — runs on every push/PR, gates everything else.
2. **Smoke** — a small set of critical happy-path tests, runs on every push/PR for fast feedback.
3. **Regression** — the full suite, split into parallel jobs by spec folder, runs on every push to `main`/`master`; a follow-up job merges every shard's report into one HTML report and publishes it, even if some tests failed.

[**📊 View Latest Automation Report**](https://gustavaom7.github.io/testsArchitecture/full-report.html)

## 👤 Author

**Gustavo** - QA Engineer

- [LinkedIn](https://www.linkedin.com/in/qa-gustavo-mesquita/)
- [GitHub](https://github.com/gustavaom7)

_Developed with ❤️ for quality assurance._
