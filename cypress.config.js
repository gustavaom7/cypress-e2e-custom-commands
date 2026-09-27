const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
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