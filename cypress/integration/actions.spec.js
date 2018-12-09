/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
  })

  it.only('smoke test', () => {
    cy.get('button').should('exist');
  });
})
