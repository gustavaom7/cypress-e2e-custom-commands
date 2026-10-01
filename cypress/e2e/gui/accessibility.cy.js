import homePage from '../../support/pageobjects/homePage'
import cartPage from '../../support/pageobjects/CartPage'

describe('Accessibility (axe-core) - Core SauceDemo Pages', () => {
  let credentials

  // WCAG 2.1 A/AA only. axe's best-practice rules also flag SauceDemo for a
  // missing <h1> and, on login, content outside landmarks; those are not
  // WCAG failures and are left out on purpose.
  const wcagOnly = {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  }

  before(() => {
    cy.fixture('gui_data').then((data) => {
      credentials = data
    })
  })

  it('login page should have no detectable accessibility violations', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.checkA11y(null, wcagOnly)
  })

  it('inventory page should have no detectable accessibility violations', () => {
    cy.login(credentials.standardUser, credentials.password)
    cy.visit('/inventory.html', { failOnStatusCode: false })
    cy.injectAxe()
    cy.checkA11y(null, wcagOnly)
  })

  it('cart page should have no detectable accessibility violations', () => {
    cy.login(credentials.standardUser, credentials.password)
    cy.visit('/inventory.html', { failOnStatusCode: false })
    homePage.addBackpackToCart()
    cartPage.openCart()
    cy.injectAxe()
    cy.checkA11y(null, wcagOnly)
  })

  it('checkout form page should have no detectable accessibility violations', () => {
    cy.login(credentials.standardUser, credentials.password)
    cy.visit('/inventory.html', { failOnStatusCode: false })
    homePage.addBackpackToCart()
    cartPage.openCart()
    cartPage.checkoutButtonClick()
    cy.injectAxe()
    cy.checkA11y(null, wcagOnly)
  })
})
