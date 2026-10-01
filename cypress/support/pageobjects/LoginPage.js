class LoginPage {
  // Locators
  elements = {
    usernameInput: () => cy.get('[data-test="username"]'),
    passwordInput: () => cy.get('[data-test="password"]'),
    loginBtn: () => cy.get('[data-test="login-button"]'),
    errorMessage: () => cy.get('[data-test="error"]')
  }

  // Actions
  visit() {
    cy.visit('https://www.saucedemo.com/')
  }

  submitLogin(username, password) {
    // cy.type() rejects empty strings; skip the field to submit it blank
    if (username) this.elements.usernameInput().type(username)
    if (password) this.elements.passwordInput().type(password)
    this.elements.loginBtn().click()
  }
}

export default new LoginPage()
