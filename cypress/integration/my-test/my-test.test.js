/// <reference types="cypress" />

describe("can navigate pages", () => {
  it("can navigate pages", () => {
    cy.visit("https://example.cypress.io/");
    cy.contains("within").click();
    cy.url().should("include", "/commands/querying");
  });
});
