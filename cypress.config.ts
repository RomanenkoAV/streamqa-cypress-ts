import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    setupNodeEvents(on, config) {
      return config
    }
  },
  viewportWidth: 1440,
  viewportHeight: 900,
  video: true,
  screenshotOnRunFailure: true,
  retries: {
    runMode: 1,
    openMode: 0
  },
  defaultCommandTimeout: 8000,
  requestTimeout: 10000,
  responseTimeout: 10000
})
