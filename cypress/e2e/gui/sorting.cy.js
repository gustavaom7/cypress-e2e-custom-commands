import homePage from '../../support/pageobjects/homePage'

describe('Product Sorting & Cart Badge Tests', () => {
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

  it('should sort products by name from Z to A', () => {
    homePage.sortBy('za')

    homePage.getProductNames().then((names) => {
      const sorted = [...names].sort().reverse()
      expect(names).to.deep.equal(sorted)
    })
  })

  it('should sort products by price from low to high', () => {
    homePage.sortBy('lohi')

    homePage.getProductPrices().then((prices) => {
      const sorted = [...prices].sort((a, b) => a - b)
      expect(prices).to.deep.equal(sorted)
    })
  })

  it('should sort products by price from high to low', () => {
    homePage.sortBy('hilo')

    homePage.getProductPrices().then((prices) => {
      const sorted = [...prices].sort((a, b) => b - a)
      expect(prices).to.deep.equal(sorted)
    })
  })

  it('should update the cart badge count as items are added', () => {
    // No badge should be visible with an empty cart
    homePage.elements.cartBadge().should('not.exist')

    homePage.addBackpackToCart()
    homePage.checkCartBadgeCount(1)

    homePage.addBikeLightToCart()
    homePage.checkCartBadgeCount(2)
  })
})
