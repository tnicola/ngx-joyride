/// <reference types="Cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });

    it('should find the start button', () => {
        cy.get('.app__start-button').should('exist');
    });

    it('should complete the tour with all the steps', () => {
        cy.get('.app__start-button').click();
        cy.get('.joyride-step__container').should('be.visible');

        for (let i = 0; i < 10; i++) {
            cy.get('.joyride-step__next-container').click();
            cy.get('.joyride-step__container').should('be.visible');
        }
        
        cy.get('.joyride-step__done-container').click();
    });
});
