import compareSnapshotCommand from 'cypress-image-diff-js/command'

compareSnapshotCommand()

describe('Visual regression', () => {
  const password = 'secret_sauce'

  // Captures before web fonts finish loading render blank text and flake
  const waitForFonts = () => cy.document().its('fonts.status').should('eq', 'loaded')

  const openInventoryAs = (username) => {
    cy.login(username, password)
    // cy.session leaves the page blank; SauceDemo serves SPA routes with a 404 status
    cy.visit('/inventory.html', { failOnStatusCode: false })
    cy.get('.inventory_item img').should('have.length', 6)
    waitForFonts()
  }

  it('login page matches baseline', () => {
    cy.visit('/')
    cy.get('.login_logo').should('be.visible')
    waitForFonts()
    cy.compareSnapshot({ name: 'login', exactName: true })
  })

  it('inventory page matches baseline', () => {
    openInventoryAs('standard_user')
    cy.compareSnapshot({ name: 'inventory', exactName: true })
  })

  it('cart page matches baseline', () => {
    openInventoryAs('standard_user')
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.get('.cart_item').should('have.length', 1)
    waitForFonts()
    cy.compareSnapshot({ name: 'cart', exactName: true })
  })

  // Showcase: visual_user renders the inventory with layout defects that no
  // functional assertion catches. Its screenshot is compared against the
  // standard_user "inventory" baseline (so it must run after that test) and
  // must differ well above the failure threshold.
  it('detects visual_user layout defects against the inventory baseline', () => {
    openInventoryAs('visual_user')
    cy.screenshot('inventory', { capture: 'viewport' })
    cy.task('compareSnapshotsPlugin', {
      testName: 'inventory',
      testThreshold: 0.01,
      failOnMissingBaseline: true,
      specFilename: Cypress.spec.name,
      specPath: Cypress.spec.relative,
    }).then(({ percentage, testFailed }) => {
      expect(testFailed, 'visual diff flagged').to.eq(true)
      expect(percentage, 'pixel difference ratio').to.be.greaterThan(0.01)
    })
  })
})
