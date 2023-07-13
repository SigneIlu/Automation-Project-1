describe('Issue deleting test cases', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click()

      //Assert that issue details view modal is visible
      cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    });
  });

it('Delete issue and validate deletion successfully - Signe test', () => {
  cy.get('[data-testid="icon:trash"]').click();
  cy.contains('Delete issue').click();
  //Assert that deletion confirmation dialogue is not visible
  cy.get('[data-testid="modal:confirm"]').should('not.exist');
  //Assert that deleted issue is not displayed on Jira board
  cy.get('[data-testid="list-issue"]').should('not.have.text', 'This is an issue of type: Task.')
});

it('Start deleting issue, but then cancel the deletion - Signe test', () => {
  cy.get('[data-testid="icon:trash"]').click();
  cy.contains('Cancel').click();
  //Assert that deletion confirmation dialogue is not visible
  cy.get('[data-testid="modal:confirm"]').should('not.exist');
  
  // Close the isse details view
  cy.get('[data-testid="icon:close"]').first().click();

  //Assert that deleted issue is not displayed on Jira board
  cy.get('[data-testid="list-issue"]').first().should('have.text', 'This is an issue of type: Task.')

});

})