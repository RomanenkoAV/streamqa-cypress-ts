import { CatalogPage } from '../pages/CatalogPage'

const catalogPage = new CatalogPage()

describe('Stream catalog', () => {
  beforeEach(() => {
    cy.loginByApi()
  })

  it('displays all streams', () => {
    catalogPage.cards().should('have.length', 3)
    catalogPage.cardByTitle('Ocean Depths VR').should('be.visible')
    catalogPage.cardByTitle('Mars Station 360').should('be.visible')
    catalogPage.cardByTitle('City Live').should('be.visible')
  })

  it('filters streams by search query', () => {
    cy.intercept('GET', '/api/catalog?q=Mars*').as('catalogSearch')
    catalogPage.searchInput().type('Mars')

    cy.wait('@catalogSearch').its('response.statusCode').should('eq', 200)
    catalogPage.cards().should('have.length', 1)
    catalogPage.cardByTitle('Mars Station 360').should('be.visible')
  })

  it('filters streams by status', () => {
    cy.intercept('GET', '/api/catalog?status=maintenance').as('statusFilter')
    catalogPage.statusFilter().select('maintenance')

    cy.wait('@statusFilter')
    catalogPage.cards().should('have.length', 1)
    catalogPage.cardByTitle('City Live').should('be.visible')
  })

  it('shows empty state when no streams match', () => {
    catalogPage.searchInput().type('Nothing here')
    catalogPage.emptyState().should('be.visible')
    catalogPage.cards().should('not.exist')
  })

  it('adds and removes a stream from favorites', () => {
    catalogPage
      .cardByTitle('Ocean Depths VR')
      .find('[data-testid="favorite-button"]')
      .click()
      .should('contain', 'Remove favorite')

    cy.request('/api/favorites').its('body.total').should('eq', 1)

    catalogPage
      .cardByTitle('Ocean Depths VR')
      .find('[data-testid="favorite-button"]')
      .click()
      .should('contain', 'Add favorite')

    cy.request('/api/favorites').its('body.total').should('eq', 0)
  })
})
