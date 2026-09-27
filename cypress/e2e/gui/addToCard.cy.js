import LoginPage from '../../support/pageobjects/LoginPage'
import addToCart from '../../support/pageobjects/homePage'
import cartPage from '../../support/pageobjects/CartPage'
import { generateCheckoutInfo } from '../../support/testData'

describe('Shopping Cart Tests', () => {
  let credentials

  before(() => {
    // Load credentials data
    cy.fixture('gui_data').then((data) => {
      credentials = data
    })
  })

  beforeEach(() => {
    // Call cy.login function from '../support/commands.js'
    cy.login(credentials.standardUser, credentials.password)
    // Visit website
    cy.visit('/inventory.html', { failOnStatusCode: false })
  })

  it('add Sauce Labs Backpack to the cart', () => {
    // Add backpack to cart
    addToCart.addBackpackToCart()
    // Open cart
    cartPage.openCart()
    // Check if item is in the cart
    cartPage.checkItemInCart('Sauce Labs Backpack')
  })

  it('remove Source Labs Backpack from the cart', () => {
    // Add backpack to cart
    addToCart.addBackpackToCart()
    // Open cart
    cartPage.openCart()
    // Check if item is in the cart
    cartPage.checkItemInCart('Sauce Labs Backpack')
    // Remove item from the cart
    cartPage.removeFromCart('Sauce Labs Backpack')
    // Check if elemet was removed successfully
    cartPage.checkItemNotVisible('Sauce Labs Backpack')
  })

  it('checkout not filling any mandatory field', () => {
    // Add backpack to cart
    addToCart.addBackpackToCart()
    // Open cart
    cartPage.openCart()
    // Check if item is in the cart
    cartPage.checkItemInCart('Sauce Labs Backpack')
    // Click checkout button
    cartPage.checkoutButtonClick()
    // Click Continue button at checkout screen
    cartPage.continueButtonCheckout()
    // Check if error is visible
    cy.checkVisible('[data-test="error"]')
  })

  it('checkout successfully', { tags: '@smoke' }, () => {
    // Add backpack to cart
    addToCart.addBackpackToCart()
    // Open cart
    cartPage.openCart()
    // Check if item is in the cart
    cartPage.checkItemInCart('Sauce Labs Backpack')
    // Click checkout button
    cartPage.checkoutButtonClick()
    // Fill form correctly
    cartPage.fillCheckoutFormCorrectly(generateCheckoutInfo())
    // Click Continue button at checkout screen
    cartPage.continueButtonCheckout()
    // Finish the operation
    cartPage.clickFinishCheckout()
    // Check confirmation message
    cy.checkVisible('[data-test="complete-header"]')
  })

  it('return to the inventory page when clicking continue shopping', () => {
    // Add backpack to cart
    addToCart.addBackpackToCart()
    // Open cart
    cartPage.openCart()
    // Click continue shopping
    cartPage.clickContinueShopping()
    // Should be back on the inventory page, with the item still in the cart
    cy.url().should('include', '/inventory.html')
    addToCart.checkCartBadgeCount(1)
  })

  it('cancel the checkout and return to the cart page', () => {
    // Add backpack to cart
    addToCart.addBackpackToCart()
    // Open cart
    cartPage.openCart()
    // Click checkout button
    cartPage.checkoutButtonClick()
    // Cancel the checkout
    cartPage.clickCancel()
    // Should be back on the cart page, item still present
    cy.url().should('include', '/cart.html')
    cartPage.checkItemInCart('Sauce Labs Backpack')
  })

  it('checkout summary total should equal subtotal plus tax', () => {
    // Add backpack to cart
    addToCart.addBackpackToCart()
    // Open cart
    cartPage.openCart()
    // Click checkout button
    cartPage.checkoutButtonClick()
    // Fill form correctly
    cartPage.fillCheckoutFormCorrectly(generateCheckoutInfo())
    // Move to the checkout overview
    cartPage.continueButtonCheckout()
    // Business rule: total must equal subtotal + tax
    cartPage.getSummaryTotals().then(({ subtotal, tax, total }) => {
      expect(total).to.be.closeTo(subtotal + tax, 0.01)
    })
  })
})
