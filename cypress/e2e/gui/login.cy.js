import LoginPage from '../../support/pageobjects/LoginPage'

describe('SauceDemo Login Tests', () => {
  // Variable to store fixture data
  let credentials

  // Load data once before tests run
  before(() => {
    cy.fixture('gui_data').then((data) => {
      credentials = data
    })
  })

  beforeEach(() => {
    LoginPage.visit()
  })

  it('should login successfully with valid credentials', () => {
    LoginPage.submitLogin(credentials.standardUser, credentials.password)

    // Validation: Verify URL redirection
    cy.url().should('include', '/inventory.html')
  })

  it('should display error message for locked out user', () => {
    LoginPage.submitLogin(credentials.lockedOutUser, credentials.password)

    // Validation: Verify specific error text
    LoginPage.elements.errorMessage().should('contain', 'Sorry, this user has been locked out')
  })

  it('should display error when username field is empty', () => {
    LoginPage.submitLogin('', credentials.password)

    LoginPage.elements.errorMessage().should('contain', 'Username is required')
    // Validation: user should remain on the login page
    cy.url().should('not.include', '/inventory.html')
  })

  it('should display error when password field is empty', () => {
    LoginPage.submitLogin(credentials.standardUser, '')

    LoginPage.elements.errorMessage().should('contain', 'Password is required')
    cy.url().should('not.include', '/inventory.html')
  })

  it('should display error for invalid password', () => {
    LoginPage.submitLogin(credentials.standardUser, credentials.invalidPassword)

    LoginPage.elements.errorMessage().should('contain', 'do not match any user')
    cy.url().should('not.include', '/inventory.html')
  })

  it('should display error for unregistered username', () => {
    LoginPage.submitLogin(credentials.invalidUsername, credentials.password)

    LoginPage.elements.errorMessage().should('contain', 'do not match any user')
    cy.url().should('not.include', '/inventory.html')
  })
})
