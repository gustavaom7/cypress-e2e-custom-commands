describe('API Testing - Mocked Failure & Latency Scenarios', () => {
  const apiUrl = 'https://jsonplaceholder.typicode.com'

  // Important distinction from users.cy.js: cy.intercept only sees requests
  // made from inside the browser (fetch/XHR issued by a visited page) — it
  // has no effect on cy.request(), which runs at the Node level and bypasses
  // Cypress's network proxy entirely. jsonplaceholder is a live public API
  // that always succeeds and always responds fast, so it can't demonstrate
  // backend-outage or slow-network behavior on its own. To stub it with
  // cy.intercept, these tests visit a page and trigger the call with the
  // browser's own fetch, so the request actually goes through Cypress's proxy.
  beforeEach(() => {
    cy.visit('/')
  })

  const fetchInBrowser = (url, options = {}) =>
    cy
      .window()
      .then((win) =>
        win
          .fetch(url, options)
          .then(async (res) => ({ status: res.status, body: await res.json().catch(() => null) }))
      )

  it('should surface a stubbed 500 server error', () => {
    cy.intercept('GET', `${apiUrl}/posts`, {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getPostsFailure')

    fetchInBrowser(`${apiUrl}/posts`).then(({ status, body }) => {
      expect(status).to.eq(500)
      expect(body).to.have.property('error')
    })

    cy.wait('@getPostsFailure')
  })

  it('should handle a forced network error gracefully', () => {
    cy.intercept('GET', `${apiUrl}/users`, { forceNetworkError: true }).as('getUsersNetworkError')

    cy.window().then((win) =>
      win.fetch(`${apiUrl}/users`).then(
        () => {
          throw new Error('fetch should not have resolved successfully')
        },
        (err) => {
          expect(err).to.exist
        }
      )
    )

    cy.wait('@getUsersNetworkError')
  })

  it('should respect a slow/delayed response instead of timing out', () => {
    cy.intercept('GET', `${apiUrl}/posts/1`, {
      statusCode: 200,
      body: { id: 1, title: 'Delayed post' },
      delay: 1000
    }).as('getSlowPost')

    fetchInBrowser(`${apiUrl}/posts/1`).then(({ status, body }) => {
      expect(status).to.eq(200)
      expect(body.title).to.eq('Delayed post')
    })

    cy.wait('@getSlowPost')
  })

  it('should send the exact payload to the stubbed endpoint', () => {
    const payload = { title: 'Stubbed title', body: 'Stubbed body', userId: 1 }

    cy.intercept('POST', `${apiUrl}/posts`, (req) => {
      expect(req.body).to.deep.equal(payload)
      req.reply({ statusCode: 201, body: { id: 101, ...req.body } })
    }).as('createPostStubbed')

    fetchInBrowser(`${apiUrl}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(({ status, body }) => {
      expect(status).to.eq(201)
      expect(body.id).to.eq(101)
      expect(body.title).to.eq(payload.title)
    })

    cy.wait('@createPostStubbed')
  })
})
