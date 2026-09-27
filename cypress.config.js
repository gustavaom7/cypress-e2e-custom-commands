const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    // Retry once in CI (`cypress run`) to absorb transient network/timing
    // flakiness against the real, public saucedemo.com/jsonplaceholder
    // services; interactive `cypress open` runs stay unaffected.
    retries: {
      runMode: 1,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      const { plugin: cypressGrepPlugin } = require('@cypress/grep/plugin');
      cypressGrepPlugin(config);
      return config;
    },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false, // Generate JSON for further merges
      json: true,
      timestamp: 'mmddyyyy_HHMMss',
    },
  },
});