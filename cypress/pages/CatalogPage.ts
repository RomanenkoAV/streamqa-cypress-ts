export class CatalogPage {
  panel() {
    return cy.get('[data-testid="catalog-panel"]')
  }

  cards() {
    return cy.get('[data-testid="stream-card"]')
  }

  searchInput() {
    return cy.get('[data-testid="search-input"]')
  }

  statusFilter() {
    return cy.get('[data-testid="status-filter"]')
  }

  errorMessage() {
    return cy.get('[data-testid="catalog-error"]')
  }

  emptyState() {
    return cy.get('[data-testid="empty-state"]')
  }

  cardByTitle(title: string) {
    return cy.contains('[data-testid="stream-card"]', title)
  }
}
