const { defineConfig } = require('cypress');
const baseConfig = require('./cypress.config');

// Visual regression runs get their own config: the image-diff plugin
// registers its own browser-launch hook (it would override Lighthouse's)
// and creates screenshot folders on every run.
module.exports = defineConfig({
  e2e: {
    ...baseConfig.e2e,
    specPattern: 'cypress/visual/**/*.cy.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    screenshotOnRunFailure: false,
    setupNodeEvents(on, config) {
      require('cypress-image-diff-js/plugin')(on, config);
      return config;
    },
  },
});
