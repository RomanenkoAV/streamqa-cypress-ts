import { CatalogPage } from '../pages/CatalogPage'

const catalogPage = new CatalogPage()

describe('Network failures and controlled responses', () => {
  beforeEach(() => {
    cy.loginByApi()
  })

  it('shows a mocked catalog response', () => {
    cy.fixture('catalog').then((catalog) => {
      cy.intercept('GET', '/api/catalog*', {
        statusCode: 200,
        delay: 250,
        body: catalog
      }).as('mockedCatalog')

      cy.visit('/')
      cy.wait('@mockedCatalog')
      catalogPage.cards().should('have.length', 1)
      catalogPage.cardByTitle('Mocked VR Concert').should('be.visible')
    })
  })

  it('shows an error when catalog API returns 500', () => {
    cy.intercept('GET', '/api/catalog*', {
      statusCode: 500,
      body: { code: 'INTERNAL_ERROR', message: 'Temporary service failure' }
    }).as('failedCatalog')

    cy.visit('/')
    cy.wait('@failedCatalog')
    catalogPage.errorMessage().should('be.visible').and('contain', 'Temporary service failure')
  })

  it('renders correctly on a mobile viewport', () => {
    cy.viewport('iphone-x')
    cy.visit('/')

    catalogPage.panel().should('be.visible')
    catalogPage.cards().should('have.length', 3)
    cy.get('[data-testid="search-input"]').should('be.visible')
  })
})
