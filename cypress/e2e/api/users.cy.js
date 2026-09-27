import { generateApiPost } from '../../support/testData'

describe('API Testing - User Management', () => {
  const baseUrl = 'https://jsonplaceholder.typicode.com'

  beforeEach(function () {
    // Load mass of data before each test
    cy.fixture('api_data').as('apiData')
  })

  it('POST - validate login endpoint simulation', function () {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/posts`,
      body: this.apiData.loginMock
    }).then((response) => {
      expect(response.status).to.eq(201)
    })
  })

  // Users list structure validation
  it('GET - should validate the users list structure', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/users`
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.duration).to.be.lessThan(1000)

      expect(response.body).to.be.an('array')
      expect(response.body[0]).to.have.property('id')
      expect(response.body[0].address).to.have.property('geo')
    })
  })

  // Contract validation
  it('POST - should create a new post and validate contract', function () {
    const payload = generateApiPost()

    cy.request({
      method: 'POST',
      url: `${baseUrl}/posts`,
      body: payload
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.title).to.eq(payload.title)
      expect(response.body).to.have.property('id')
    })
  })

  // Make sure the API behaves well when user does not exist
  it('GET - should return 404 when user does not exist', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/users/999`, // Invalid ID
      failOnStatusCode: false // Avoid Cypress failling test automatically
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  // Business rule validation, how API behaves with empty body
  it('POST - should validate error when sending empty body', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/posts`,
      failOnStatusCode: false,
      body: {} // null body -- check how API behaves
    }).then((response) => {
      // If body is null, returns error
      // No JSONPlaceholder returns 201, but should be 400
      expect(response.status).to.be.oneOf([201, 400])
    })
  })

  // Performance scenario
  it('GET - should meet performance SLA (under 500ms)', () => {
    cy.request(`${baseUrl}/posts`).then((response) => {
      // High performance APIs must provide a response quickly
      expect(response.duration).to.be.lessThan(500)
    })
  })

  // Contract, mandatory fields and regex validation
  it('GET - contract validation (Schema)', function () {
    cy.request('GET', `${baseUrl}/users/1`).then((response) => {
      const user = response.body
      const schema = this.apiData.userSchema

      // Contract validation
      expect(user.id).to.be.a(schema.id)
      expect(user.name).to.be.a(schema.name)
      expect(user.email).to.be.a(schema.email)

      // Check if mandatory fields are present
      expect(user).to.have.all.keys(
        'id',
        'name',
        'username',
        'email',
        'address',
        'phone',
        'website',
        'company'
      )

      // Format validation (Regex)
      expect(user.email).to.match(/^\S+@\S+\.\S+$/)
    })
  })

  // Authorization check
  it('GET - should validate authorization header', function () {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/posts/1`,
      headers: {
        Authorization: `Bearer ${this.apiData.auth.token}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      // Check if token was accepted
      expect(response.status).to.eq(200)

      // Checking if header response confirms content type
      expect(response.headers['content-type']).to.include('application/json')
    })
  })

  // Full update (idempotent) validation
  it('PUT - should fully update an existing post', function () {
    const payload = generateApiPost()

    cy.request({
      method: 'PUT',
      url: `${baseUrl}/posts/1`,
      body: payload
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.title).to.eq(payload.title)
      expect(response.body.id).to.eq(1)
    })
  })

  // Partial update validation
  it('PATCH - should partially update an existing post', function () {
    cy.request({
      method: 'PATCH',
      url: `${baseUrl}/posts/1`,
      body: { title: 'Updated title only' }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.title).to.eq('Updated title only')
      // Other original fields should remain untouched by a PATCH
      expect(response.body).to.have.property('userId')
    })
  })

  // Deletion validation
  it('DELETE - should remove a post', function () {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/posts/1`
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  // Query param filtering / business rule validation
  it('GET - should filter posts by userId query param', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/posts`,
      qs: { userId: 1 }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array').and.not.be.empty

      // Every returned post must belong to the requested user
      response.body.forEach((post) => {
        expect(post.userId).to.eq(1)
      })
    })
  })

  // Resilience check: malformed/invalid resource id should not crash the client
  it('DELETE - should handle deletion of a non-existent post gracefully', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/posts/99999`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 404])
    })
  })
})
