Cypress.Commands.add('checkVisible', (selector) => {
  cy.get(selector).should('be.visible')
})

Cypress.Commands.add('checkNotVisible', (selector) => {
  cy.get(selector).should('not.be.visible')
})

// Logs in via cy.session so the login flow only runs once per user/spec run
Cypress.Commands.add('login', (username, password) => {
  cy.session(
    [username, password],
    () => {
      cy.visit('/')
      cy.get('[data-test="username"]').type(username)
      cy.get('[data-test="password"]').type(password)
      cy.get('[data-test="login-button"]').click()
      cy.url().should('contain', '/inventory.html')
    },
    {
      validate() {
        // Check if session's cookie or Home element exist
        cy.get('.shopping_cart_link').should('be.visible')
      },
      cacheAcrossSpecs: true // share session across different test files
    }
  )
})
