const cypress = require('eslint-plugin-cypress')
const prettier = require('eslint-config-prettier')

module.exports = [
  {
    ignores: ['node_modules', 'cypress/reports', 'cypress/screenshots', 'cypress/videos'],
  },
  {
    files: ['cypress/**/*.js'],
    plugins: { cypress },
    languageOptions: {
      ...cypress.configs.recommended.languageOptions,
      sourceType: 'module',
    },
    rules: {
      ...cypress.configs.recommended.rules,
    },
  },
  prettier,
]
