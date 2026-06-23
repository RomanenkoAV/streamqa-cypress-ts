declare global {
  namespace Cypress {
    interface Chainable {
      loginByApi(email?: string, password?: string): Chainable<void>
      resetSession(): Chainable<void>
    }
  }
}

Cypress.Commands.add('loginByApi', (email = 'qa@stream.local', password = 'Qwerty123!') => {
  cy.request('POST', '/api/login', { email, password }).then(({ body }) => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', body.token)
      }
    })
  })
})

Cypress.Commands.add('resetSession', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
})

export {}
