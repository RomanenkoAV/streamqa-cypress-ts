import { LoginPage } from '../pages/LoginPage'
import { CatalogPage } from '../pages/CatalogPage'

describe('Authentication', () => {
  const loginPage = new LoginPage()
  const catalogPage = new CatalogPage()

  beforeEach(() => {
    loginPage.visit()
  })

  it('logs in with valid credentials', () => {
    cy.fixture('users').then(({ valid }) => {
      cy.intercept('POST', '/api/login').as('loginRequest')
      loginPage.login(valid.email, valid.password)

      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
      catalogPage.panel().should('be.visible')
      cy.window().its('localStorage.token').should('eq', 'demo-token-qa')
    })
  })

  it('shows an error for invalid credentials', () => {
    cy.fixture('users').then(({ invalid }) => {
      cy.intercept('POST', '/api/login').as('loginRequest')
      loginPage.login(invalid.email, invalid.password)

      cy.wait('@loginRequest').its('response.statusCode').should('eq', 401)
      loginPage.errorMessage().should('be.visible').and('contain', 'Invalid email or password')
      catalogPage.panel().should('not.be.visible')
    })
  })

  it('validates empty fields through the API', () => {
    cy.request({
      method: 'POST',
      url: '/api/login',
      failOnStatusCode: false,
      body: {}
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.deep.include({
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required'
      })
    })
  })
})
