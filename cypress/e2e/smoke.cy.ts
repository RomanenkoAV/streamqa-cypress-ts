import { LoginPage } from '../pages/LoginPage'
import { CatalogPage } from '../pages/CatalogPage'

describe('Smoke tests', () => {
  const loginPage = new LoginPage()
  const catalogPage = new CatalogPage()

  it('opens the application and signs in with valid credentials', () => {
    cy.fixture('users').then(({ valid }) => {
      loginPage.visit().login(valid.email, valid.password)
      catalogPage.panel().should('be.visible')
      catalogPage.cards().should('have.length', 3)
    })
  })

  it('returns healthy service status', () => {
    cy.request('/api/health').its('body').should('include', {
      status: 'ok',
      service: 'streamqa-demo'
    })
  })
})
