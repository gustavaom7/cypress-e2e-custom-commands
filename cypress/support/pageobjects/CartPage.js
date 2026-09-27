class cartPage {
    //Locators
    elements = {
        // Locators
        continueShoppingButton: () => cy.get('[data-test="continue-shopping"]'),
        checkoutButton: () => cy.get('[data-test="checkout"]'),
        shoppingCartButton: () => cy.get('[data-test="shopping-cart-link"]'),
        cartItemRow: () => cy.get('.cart_item'),
        firstNameField: () => cy.get('[data-test="firstName"]'),
        lastNameField: () => cy.get('[data-test="lastName"]'),
        postalCodeField: () => cy.get('[data-test="postalCode"]'),
        continueButtonCheckout: () => cy.get('[data-test="continue"]'),
        finishCheckout: () => cy.get('[data-test="finish"]'),
        cancelButton: () => cy.get('[data-test="cancel"]'),
        subtotalLabel: () => cy.get('[data-test="subtotal-label"]'),
        taxLabel: () => cy.get('[data-test="tax-label"]'),
        totalLabel: () => cy.get('[data-test="total-label"]')
    }

    // Actions
    clickContinueShopping() {
        this.elements.continueShoppingButton().click()
    }

    clickCheckoutButton() {
        this.elements.checkoutButton().click()
    }

    openCart() {
        this.elements.shoppingCartButton().click()
    }

    checkItemInCart(itemName) {
        // Search for a text
        cy.get('[data-test="cart-list"]').should('contain', itemName)
    }

    removeFromCart(itemName) {
        // Remove item from cart
        this.elements.cartItemRow()
            .contains(itemName)
            .parents('.cart_item')    
            .find('button')           
            .click()
    }

    checkItemNotVisible(itemName) {
        cy.contains('.inventory_item_name', itemName).should('not.exist')
    }

    checkItemVisibleCheckoutScreen(itemName) {
        cy.contains('body', itemName).should('be.visible')
        cy.get('[data-test="checkout-info-container"]').should('contain')
    }

    checkoutButtonClick() {
        this.elements.checkoutButton().click()
    }

    continueButtonCheckout() {
        this.elements.continueButtonCheckout().click()
    }

    fillCheckoutFormCorrectly(checkoutInfo) {
        this.elements.firstNameField().type(checkoutInfo.firstName)
        this.elements.lastNameField().type(checkoutInfo.lastName)
        this.elements.postalCodeField().type(checkoutInfo.postalCode)
    }

    clickFinishCheckout() {
        this.elements.finishCheckout().click()
    }

    clickCancel() {
        this.elements.cancelButton().click()
    }

    // Extracts a numeric value from labels like "Item total: $29.99"
    getSummaryTotals() {
        return this.elements.subtotalLabel().invoke('text').then(subtotalText => {
            const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''))
            return this.elements.taxLabel().invoke('text').then(taxText => {
                const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''))
                return this.elements.totalLabel().invoke('text').then(totalText => {
                    const total = parseFloat(totalText.replace(/[^0-9.]/g, ''))
                    return { subtotal, tax, total }
                })
            })
        })
    }

}

export default new cartPage();