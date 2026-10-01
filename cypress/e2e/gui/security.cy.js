import homePage from '../../support/pageobjects/homePage'
import cartPage from '../../support/pageobjects/CartPage'
import LoginPage from '../../support/pageobjects/LoginPage'

// Non-intrusive security checks: they only read what the site already returns
// and act like a regular user (no scanning, fuzzing or load). "FINDING" tests
// assert a weakness EXISTS, like knownIssues.cy.js: if SauceDemo fixes it, the
// test fails and the finding needs re-triage.
describe('Security checks', () => {
  const password = 'secret_sauce'
  const xssPayloads = ['<script>alert("xss")</script>', '<img src=x onerror=alert("xss")>']

  const assertNoInjection = () => {
    cy.get('@alert').should('not.have.been.called')
    cy.get('script:contains("xss"), img[src="x"]').should('not.exist')
  }

  context('Response headers', () => {
    // SauceDemo is served by GitHub Pages, which sends no security headers
    const missingHeaders = [
      'content-security-policy',
      'strict-transport-security',
      'x-frame-options',
      'x-content-type-options',
    ]

    missingHeaders.forEach((header) => {
      it(`FINDING: ${header} header is missing`, () => {
        cy.request('/').its('headers').should('not.have.property', header)
      })
    })

    it('does not disclose the backend framework', () => {
      cy.request('/').its('headers').should('not.have.property', 'x-powered-by')
    })
  })

  context('Session cookie', () => {
    beforeEach(() => {
      LoginPage.visit()
      LoginPage.submitLogin('standard_user', password)
      cy.url().should('include', '/inventory.html')
    })

    it('FINDING: session cookie is readable by JavaScript (no HttpOnly)', () => {
      cy.getCookie('session-username').should('have.property', 'httpOnly', false)
      cy.document().its('cookie').should('include', 'session-username=standard_user')
    })

    it('FINDING: session cookie is sent over plain HTTP too (no Secure flag)', () => {
      cy.getCookie('session-username').should('have.property', 'secure', false)
    })

    it('removes the session cookie on logout', () => {
      homePage.elements.menuButton().click()
      homePage.elements.logoutLink().click()
      cy.getCookie('session-username').should('be.null')
    })
  })

  context('Access control', () => {
    ;['/inventory.html', '/cart.html', '/checkout-step-one.html'].forEach((path) => {
      it(`redirects ${path} to login without a session`, () => {
        cy.visit(path, { failOnStatusCode: false })
        LoginPage.elements.errorMessage().should(
          'contain',
          `You can only access '${path}' when you are logged in`,
        )
      })
    })

    it('blocks locked_out_user', () => {
      LoginPage.visit()
      LoginPage.submitLogin('locked_out_user', password)
      LoginPage.elements.errorMessage().should('contain', 'this user has been locked out')
      // The app still writes the session cookie here, but it is rejected
      cy.visit('/inventory.html', { failOnStatusCode: false })
      LoginPage.elements.errorMessage().should('contain', 'when you are logged in')
    })

    it('rejects a session cookie for an unknown user', () => {
      cy.setCookie('session-username', 'forged_user')
      cy.visit('/inventory.html', { failOnStatusCode: false })
      LoginPage.elements.errorMessage().should('contain', 'when you are logged in')
    })

    it('FINDING: a session cookie with a known username grants access without a password', () => {
      // The session is just the plain username: no token or signature
      cy.setCookie('session-username', 'standard_user')
      cy.visit('/inventory.html', { failOnStatusCode: false })
      homePage.elements.productNames().should('have.length', 6)
    })
  })

  context('Input handling', () => {
    beforeEach(() => {
      cy.on('window:alert', cy.stub().as('alert'))
    })

    xssPayloads.forEach((payload) => {
      it(`does not execute "${payload}" in the login form`, () => {
        LoginPage.visit()
        LoginPage.submitLogin(payload, payload)
        LoginPage.elements.errorMessage().should('be.visible')
        assertNoInjection()
      })

      it(`does not execute "${payload}" in the checkout form`, () => {
        LoginPage.visit()
        LoginPage.submitLogin('standard_user', password)
        homePage.addBackpackToCart()
        cartPage.openCart()
        cartPage.checkoutButtonClick()
        cartPage.fillCheckoutFormCorrectly({ firstName: payload, lastName: payload, postalCode: payload })
        cartPage.continueButtonCheckout()
        cy.url().should('include', '/checkout-step-two.html')
        assertNoInjection()
      })
    })
  })
})
