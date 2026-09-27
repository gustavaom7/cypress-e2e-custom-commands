import homePage from '../../support/pageobjects/homePage'
import cartPage from '../../support/pageobjects/CartPage'

describe('Accessibility (axe-core) - Core SauceDemo Pages', () => {
  let credentials

  before(() => {
    cy.fixture('gui_data').then((data) => {
      credentials = data
    })
  })

  it('login page should have no detectable accessibility violations', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.checkA11y()
  })

  it('inventory page should have no detectable accessibility violations', () => {
    cy.login(credentials.standardUser, credentials.password)
    cy.visit('/inventory.html', { failOnStatusCode: false })
    cy.injectAxe()
    cy.checkA11y()
  })

  it('cart page should have no detectable accessibility violations', () => {
    cy.login(credentials.standardUser, credentials.password)
    cy.visit('/inventory.html', { failOnStatusCode: false })
    homePage.addBackpackToCart()
    cartPage.openCart()
    cy.injectAxe()
    cy.checkA11y()
  })

  it('checkout form page should have no detectable accessibility violations', () => {
    cy.login(credentials.standardUser, credentials.password)
    cy.visit('/inventory.html', { failOnStatusCode: false })
    homePage.addBackpackToCart()
    cartPage.openCart()
    cartPage.checkoutButtonClick()
    cy.injectAxe()
    cy.checkA11y()
  })
})
