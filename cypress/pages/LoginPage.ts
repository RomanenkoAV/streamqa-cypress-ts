export class LoginPage {
  visit() {
    cy.visit('/')
    return this
  }

  emailInput() {
    return cy.get('[data-testid="email-input"]')
  }

  passwordInput() {
    return cy.get('[data-testid="password-input"]')
  }

  submitButton() {
    return cy.get('[data-testid="login-button"]')
  }

  errorMessage() {
    return cy.get('[data-testid="login-error"]')
  }

  login(email: string, password: string) {
    this.emailInput().clear().type(email)
    this.passwordInput().clear().type(password, { log: false })
    this.submitButton().click()
  }
}
