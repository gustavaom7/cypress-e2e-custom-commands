import homePage from '../../support/pageobjects/homePage'
import cartPage from '../../support/pageobjects/CartPage'

// SauceDemo ships special users with deliberate defects. These tests assert
// the defects EXIST, documenting each finding: if SauceDemo ever fixes one,
// the matching test fails and the finding needs re-triage.
describe('Known issues - SauceDemo special users', () => {
  const password = 'secret_sauce'

  const goToInventory = (username) => {
    cy.login(username, password)
    // cy.session leaves the page blank; SauceDemo serves SPA routes with a 404 status
    cy.visit('/inventory.html', { failOnStatusCode: false })
  }

  context('problem_user', () => {
    beforeEach(() => goToInventory('problem_user'))

    it('BUG: every product shows the same image', () => {
      cy.get('.inventory_item img').then(($imgs) => {
        const sources = new Set([...$imgs].map((img) => img.getAttribute('src')))
        expect($imgs.length).to.be.greaterThan(1)
        expect(sources.size, 'distinct image sources').to.eq(1)
      })
    })

    it('BUG: sorting by name Z to A does not reorder products', () => {
      homePage.elements.productNames().then(($before) => {
        const before = [...$before].map((el) => el.innerText)
        homePage.elements.sortDropdown().select('za')
        homePage.elements.productNames().should(($after) => {
          expect([...$after].map((el) => el.innerText)).to.deep.eq(before)
        })
      })
    })

    it('BUG: the checkout last name field does not accept input', () => {
      homePage.addBackpackToCart()
      cartPage.openCart()
      cartPage.checkoutButtonClick()
      cartPage.elements.firstNameField().type('Ada')
      cartPage.elements.lastNameField().type('Lovelace')
      cartPage.elements.lastNameField().should('have.value', '')
    })
  })

  context('error_user', () => {
    beforeEach(() => goToInventory('error_user'))

    it('BUG: sorting products shows a "Sorting is broken" alert', () => {
      const alert = cy.stub().as('alert')
      cy.on('window:alert', alert)
      homePage.elements.sortDropdown().select('za')
      cy.get('@alert').should('have.been.calledWithMatch', /sorting is broken/i)
    })

    it('BUG: adding the Fleece Jacket to the cart throws and adds nothing', () => {
      // The app throws on this click; capture it as the bug instead of failing the test
      const appError = cy.stub().returns(false).as('appError')
      cy.on('uncaught:exception', appError)
      homePage.elements.addToCartFleeceJacket().click()
      const { match } = Cypress.sinon
      cy.get('@appError').should('have.been.calledWithMatch', match.has('message', match(/Failed to add item to the cart/)))
      homePage.elements.cartBadge().should('not.exist')
    })
  })

  context('performance_glitch_user', () => {
    it('BUG: login is much slower than for standard_user', () => {
      const timeLogin = (username) => {
        cy.visit('/')
        cy.get('[data-test="username"]').type(username)
        cy.get('[data-test="password"]').type(password)
        return cy
          .then(() => Date.now())
          .then((start) => {
            cy.get('[data-test="login-button"]').click()
            cy.get('.inventory_list', { timeout: 15000 }).should('be.visible')
            return cy.then(() => Date.now() - start)
          })
      }

      timeLogin('standard_user').then((baseline) => {
        timeLogin('performance_glitch_user').then((glitched) => {
          // SauceDemo injects a ~5s delay; 2s of margin keeps this stable
          expect(glitched - baseline, 'extra login time (ms)').to.be.greaterThan(2000)
        })
      })
    })
  })
})
