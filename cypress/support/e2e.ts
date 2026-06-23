import './commands'

beforeEach(() => {
  cy.request('POST', '/api/test/reset')
  cy.resetSession()
})
