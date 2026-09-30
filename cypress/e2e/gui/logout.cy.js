import homePage from '../../support/pageobjects/homePage'

describe('SauceDemo Logout Tests', () => {
  let credentials

  before(() => {
    cy.fixture('gui_data').then((data) => {
      credentials = data
    })
  })

  beforeEach(() => {
    cy.login(credentials.standardUser, credentials.password)
    cy.visit('/inventory.html', { failOnStatusCode: false })
  })

  it('should logout successfully and redirect to the login page', () => {
    homePage.logout()

    cy.url().should('eq', 'https://www.saucedemo.com/')
    cy.get('[data-test="login-button"]').should('be.visible')
  })

  it('should not allow access to inventory after logging out', () => {
    homePage.logout()

    // Attempt to access a protected page directly after logout
    cy.visit('/inventory.html', { failOnStatusCode: false })
    cy.url().should('not.include', '/inventory.html')
  })
})
