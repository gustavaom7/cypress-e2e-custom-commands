describe('Lighthouse - web vitals', () => {
  const options = { formFactor: 'desktop', screenEmulation: { disabled: true } }
  // Deliberately loose: Lighthouse scores vary ~±5 points between runs.
  const thresholds = { performance: 60, accessibility: 85, 'best-practices': 75 }

  it('login page meets thresholds', () => {
    cy.visit('/')
    cy.lighthouse(thresholds, options)
  })

  it('inventory page meets thresholds', () => {
    cy.login('standard_user', 'secret_sauce')
    // cy.session leaves the page blank; SauceDemo serves SPA routes with a 404 status
    cy.visit('/inventory.html', { failOnStatusCode: false })
    cy.url().should('include', '/inventory.html')
    cy.lighthouse(thresholds, options)
  })
})
