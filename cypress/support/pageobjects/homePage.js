class addToCart {
  // Locators
  elements = {
    // Add to Cart buttons
    addToCartBackpack: () => cy.get('[data-test="add-to-cart-sauce-labs-backpack"]'),
    addToCartBikeLight: () => cy.get('[data-test="add-to-cart-sauce-bike-light"]'),
    addToCartBoltTShirt: () => cy.get('[data-test="add-to-cart-sauce-bolt-t-shirt"]'),
    addToCartFleeceJacket: () => cy.get('[data-test="add-to-cart-sauce-labs-fleece-jacket"]'),
    addToCartOnesie: () => cy.get('[data-test="add-to-cart-sauce-labs-onesie"]'),
    addToCartTShirtRed: () => cy.get('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]'),

    // Sorting & listing
    sortDropdown: () => cy.get('[data-test="product-sort-container"]'),
    productNames: () => cy.get('.inventory_item_name'),
    productPrices: () => cy.get('.inventory_item_price'),

    // Cart badge
    cartBadge: () => cy.get('[data-test="shopping-cart-badge"]'),

    // Menu / logout
    menuButton: () => cy.get('#react-burger-menu-btn'),
    logoutLink: () => cy.get('#logout_sidebar_link')
  }

  // Actions
  addBackpackToCart() {
    this.elements.addToCartBackpack().click()
  }

  addBikeLightToCart() {
    this.elements.addToCartBikeLight().click()
  }

  sortBy(value) {
    this.elements.sortDropdown().select(value)
  }

  getProductNames() {
    return this.elements.productNames().then(($items) => [...$items].map((item) => item.innerText))
  }

  getProductPrices() {
    return this.elements
      .productPrices()
      .then(($items) => [...$items].map((item) => parseFloat(item.innerText.replace('$', ''))))
  }

  checkCartBadgeCount(count) {
    this.elements.cartBadge().should('have.text', String(count))
  }

  logout() {
    this.elements.menuButton().click()
    this.elements.logoutLink().click()
  }
}

export default new addToCart()
