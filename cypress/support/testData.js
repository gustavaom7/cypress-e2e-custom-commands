const { faker } = require('@faker-js/faker')

// Centralizes dynamic test data generation so specs don't hardcode values that
// don't need to be fixed. SauceDemo login credentials stay in fixtures/gui_data.json
// since they must match the app's fixed user list — only free-form input (checkout
// details, API post content) is generated here.

export const generateCheckoutInfo = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  postalCode: faker.location.zipCode()
})

export const generateApiPost = (userId = 1) => ({
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  userId
})
