import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:3333',
    excludeSpecPattern: '**/advanced-examples/',
  },
})
