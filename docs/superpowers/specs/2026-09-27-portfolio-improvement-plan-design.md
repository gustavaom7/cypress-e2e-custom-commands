# Cypress Portfolio Improvement Plan

**Status:** Approved for execution
**Purpose of this repo:** QA portfolio piece (job applications), not a production backend.
**Constraints:** 100% free (GitHub Actions + open-source npm packages only, no paid SaaS).

## Goals

1. Remove technical debt and CI bugs found during the repo scan, before adding anything new.
2. Improve baseline code quality (lint/format).
3. Add new, genuinely useful test capabilities that read well in a QA portfolio:
   API-level mocking with `cy.intercept`, accessibility testing (`cypress-axe`), and
   dynamic test data generation (`@faker-js/faker`).
4. Introduce real smoke/regression tagging and a faster, parallelized CI pipeline.

Each phase below ships as its own set of commits on `feature/qa-portfolio-improvements`,
kept green (lint + tests passing) before moving to the next phase.

## Phase 0 — Cleanup / technical debt

- Remove `cypress/report/report.js`: dead code, requires `multiple-cucumber-html-reporter`
  (not an installed dependency) and reads from a `cucumber-json/` directory that doesn't
  exist. No BDD/Cucumber is used anywhere in this project.
- Remove unused dependencies: `cypress-tags`, `cypress-dotenv`, `dotenv` — none are
  referenced anywhere in the codebase (no `process.env`, no dotenv config, no tags).
  `cypress-tags` is superseded in Phase 5 by the actively maintained `@cypress/grep`.
- Fix CI report-generation bug in `.github/workflows/cypress.yml`: the run command is
  `npm run test:all && npm run generate:report`, so when tests fail the `&&`
  short-circuits and the report is never generated — the one case it matters most.
  The separate "Generate HTML Report" step is also not `if: always()`, so it's skipped
  too on failure, and it duplicates report generation on success. Fix: always generate
  the report regardless of test outcome, and drop the duplicate step.
- Fix report path mismatch: `create:html` writes `cypress/reports/full-report.html`
  directly under `cypress/reports`, but CI uploads the artifact from
  `cypress/reports/html/` and deploys `cypress/reports` to `gh-pages` — the `html/`
  subfolder the workflow expects is never actually produced by the scripts.
- Untrack accidentally committed generated/OS files: `.DS_Store` and the stale
  `cypress/reports/html/merged-report.html`, both of which `.gitignore` already
  excludes going forward. Add `.DS_Store` to `.gitignore`.
- Wire the existing but unused `prereport` script into the report pipeline so old
  report files don't accumulate across runs.
- Fix README/`package.json` script mismatch: README documents `npm run test:headed`
  and `npm run test:headless`, neither of which exists as a script.
- Move hardcoded personal data (`'Gustavo'`, `'Mesquita'`, postal code) out of
  `CartPage.fillCheckoutFormCorrectly()` and into `gui_data.json`, matching the
  data-driven pattern used everywhere else in the suite.

## Phase 1 — Code quality tooling

- Add ESLint (with `eslint-plugin-cypress`) and Prettier, with `lint`/`format` npm
  scripts.
- Clean up leftover Cypress boilerplate comments in `support/commands.js` and
  `support/e2e.js`.
- Run lint as a CI step so regressions are caught automatically.

## Phase 2 — API-level mocking with `cy.intercept`

SauceDemo has no real backend (all inventory/login data is static/client-side), so
there are no meaningful network calls to stub on the UI side. The legitimate,
honest use of `cy.intercept` here is on the API suite, against `jsonplaceholder`:

- Add scenarios that the live third-party API cannot reliably produce on demand:
  a stubbed `500` server error, a forced network error, and a slow/stubbed response
  to assert timeout-handling behavior — using `cy.intercept` + `cy.wait('@alias')`.

## Phase 3 — Accessibility testing (`cypress-axe`)

- Add `cypress-axe` + `axe-core`, wire a `cy.checkA11y()` custom command.
- New spec covering the login, inventory, cart, and checkout pages.

## Phase 4 — Dynamic test data with Faker

- Add `@faker-js/faker`.
- Generate checkout form data (name, postal code) and API POST payload content
  (post title/body) dynamically instead of hardcoding them, while keeping
  SauceDemo login credentials static (they must match the app's fixed user list).

## Phase 5 — Smoke/regression tagging + parallel CI

- Add `@cypress/grep` (actively maintained; replaces the removed `cypress-tags`).
- Tag a small set of critical happy-path tests `@smoke` (login success, add-to-cart,
  full checkout, one API happy-path GET/POST); everything else is `@regression`.
- Add `test:smoke` / `test:regression` npm scripts.
- Restructure CI: run `@smoke` on every push/PR for fast feedback; run the full
  regression suite as a parallel matrix (split by spec file across jobs) on pushes
  to `main`, merging reports across shards.

## Explicitly out of scope for this round

Cross-browser matrix and visual regression testing were considered but deprioritized
by the repo owner for this pass — logged here so they aren't lost, in case a future
round wants to pick them up.

## Delivery

Direct commits to `feature/qa-portfolio-improvements` (no PR process — this is a solo
portfolio repo), at least one commit per bullet above, kept independently revertable.
The branch is left for review; nothing is pushed to `origin` or merged to `main`
without explicit go-ahead.
