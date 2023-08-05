describe('Time esimation & Time logging test cases', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //System will already open issue creating modal in beforeEach block  
    cy.visit(url + '/board?modal-issue-create=true');
    });
  })

//Constant Values
const taskNameEst = 'Time Estimation Task';
const taskDescription = 'Test_Description';

//Constant Actions
const getIssueCloseAndReopen = () => {
  cy.get('[data-testid="icon:close"]').click();
  cy.get('[data-testid="board-list:backlog"]').contains(taskNameEst).click() 
}

const createIssueAndReopen = () =>{
  cy.get('[data-testid="modal:issue-create"]').within (() => {
    cy.get('[data-testid="form-field:description"]').type(taskDescription);
    cy.get('input[name="title"]').type(taskNameEst);
    cy.get('button[type="submit"]').click();
    });
    // Open created issue
  cy.wait(300);
  cy.get('[data-testid="board-list:backlog"]').should('be.visible');    
  cy.get('[data-testid="board-list:backlog"]').contains(taskNameEst).click()
}

const openTimeTrackingPopup = () => {
  cy.get('[data-testid="icon:stopwatch"]').click();
  cy.get('[data-testid="modal:tracking"]').should('be.visible');
}

it('Time estimation functionality - Add, update and remove estimation', () => {
    createIssueAndReopen();

  //Assert No time logged is visible
    cy.contains('No time logged').should('be.visible');
  
  //Add Estimated time 10 and assert it is added
    cy.get('input[placeholder="Number"]').type('10').type('{enter}');
    cy.wait(300);
    getIssueCloseAndReopen();  
    cy.contains('10h estimated').should('be.visible');

  //Edit estimation 10 to 20 hours & assert it is edited
    cy.get('input[placeholder="Number"]').clear().type('20').type('{enter}');
    cy.wait(300);
    getIssueCloseAndReopen();
    cy.contains('20h estimated').should('be.visible');

    //Remove estimated hours & assert 'No Time logged' is visible
    cy.get('input[placeholder="Number"]').clear().type('{enter}');
    getIssueCloseAndReopen();
    cy.contains('No time logged').should('be.visible');
    cy.get('[data-testid="icon:close"]').click();

})

it('Time logging functionality - Logging time and removing logged time ', () => {
  createIssueAndReopen();
  // Insert estimation time
  cy.get('input[placeholder="Number"]').type('7').type('{enter}');
  
  //Open time tracking pop-up and assert time tracking pop-up is visible
  openTimeTrackingPopup();
  
  //Enter value 2 for "time spent" and 5 for "Time remaining"
  cy.get('input[placeholder="Number"]').eq(1).type('2').type('{enter}');
  cy.get('input[placeholder="Number"]').eq(2).type('5').type('{enter}');
  cy.contains('button', 'Done').click();

  //Asserts "time spent" and "Time remaining" values are visible
  getIssueCloseAndReopen();
  cy.contains('No time logged').should('not.exist');
  cy.contains('2h logged').should('be.visible');
  cy.contains('5h remaining').should('be.visible');

  //Opens time tracking pop-up and removes values from "time spent" and "Time remaining"
  openTimeTrackingPopup();
  cy.get('input[placeholder="Number"]').eq(1).clear().type('{enter}');
  cy.get('input[placeholder="Number"]').eq(2).clear().type('{enter}');
  cy.contains('button', 'Done').click();
  
  //Asserts spent time logged is not visible and original estimated time is visible
  getIssueCloseAndReopen();
  cy.contains('No time logged').should('be.visible');
  cy.contains('2h logged').should('not.exist');
  cy.contains('7h estimated').should('be.visible');
  cy.get('[data-testid="icon:close"]').click();

});
})
