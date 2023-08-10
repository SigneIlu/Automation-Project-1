describe('Time esimation & Time logging test cases', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //System will already open issue creating modal in beforeEach block  
    cy.visit(url + '/board?modal-issue-create=true');
    });
  })

//Constant Values & Selectors
//test 1 - time estimation
const taskNameEst = 'Time Estimation Task';
const taskDescription = 'Test_Description';
const estimatedTime1 = '10'
const estimatedTime2 = '20'
//test 2 - logging time
const estimatedTime3 = '7'
const timeSpent = '2'
const timeRemaining = estimatedTime3-timeSpent

const estimatedTimeField = 'input[placeholder="Number"]'

//Constant Actions
const createIssueAndReopen = () =>{
  cy.get('[data-testid="modal:issue-create"]').within (() => {
    cy.get('[data-testid="form-field:description"]').type(taskDescription);
    cy.get('input[name="title"]').type(taskNameEst);
    cy.get('button[type="submit"]').click();
    });
  cy.wait(300);
  cy.get('[data-testid="board-list:backlog"]').should('be.visible');    
  cy.get('[data-testid="board-list:backlog"]').contains(taskNameEst).click()
}

const openTimeTrackingPopup = () => {
  cy.get('[data-testid="icon:stopwatch"]').click();
  cy.get('[data-testid="modal:tracking"]').should('be.visible');
}

const getIssueCloseAndReopen = () => {
  cy.get('[data-testid="icon:close"]').click();
  cy.get('[data-testid="board-list:backlog"]').contains(taskNameEst).click() 
}

const getTimeSpentField = () => cy.get('input[placeholder="Number"]').eq(1)
const getTimeRemainingField = () => cy.get('input[placeholder="Number"]').eq(2)



it('Time estimation functionality - Add, update and remove estimation', () => {
    createIssueAndReopen();
    cy.contains('No time logged').should('be.visible');
  
  //Add Estimated time and assert it is inserted
    cy.get(estimatedTimeField).type(estimatedTime1).type('{enter}');
    cy.wait(300);
    getIssueCloseAndReopen();
    cy.get(estimatedTimeField).should('have.value', estimatedTime1);

  //Edit estimated hours & assert edited value is inserted
    cy.get(estimatedTimeField).clear().type(estimatedTime2).type('{enter}');
    cy.wait(300);
    getIssueCloseAndReopen();
    cy.get(estimatedTimeField).should('have.value', estimatedTime2);

  //Remove estimated hours & assert 'No Time logged' is visible
    cy.get(estimatedTimeField).clear().type('{enter}');
    getIssueCloseAndReopen();
    cy.contains('No time logged').should('be.visible');
    cy.get('[data-testid="icon:close"]').click();
})

it('Time logging functionality - Logging time and removing logged time ', () => {
  createIssueAndReopen();
  // Insert estimation time
  cy.get(estimatedTimeField).type(estimatedTime3).type('{enter}');
  
  //Enter value for "time spent" and value for "Time remaining"
  openTimeTrackingPopup();
  getTimeSpentField().type(timeSpent).type('{enter}');
  getTimeRemainingField().type(timeRemaining).type('{enter}');
  cy.contains('button', 'Done').click();

  //Asserts "time spent" and "Time remaining" values are visible
  getIssueCloseAndReopen();
  cy.contains('No time logged').should('not.exist');
  cy.contains(`${timeSpent}h logged`).should('be.visible');
  cy.contains(`${timeRemaining}h remaining`).should('be.visible');

  //Removes values from "time spent" and "Time remaining"
  openTimeTrackingPopup();
  getTimeSpentField().clear().type('{enter}');
  getTimeRemainingField().clear().type('{enter}');
  cy.contains('button', 'Done').click();
  
  //Asserts 'No time logged' is visible and original estimated time is visible
  getIssueCloseAndReopen();
  cy.contains('No time logged').should('be.visible');
  cy.contains(`${estimatedTime3}h estimated`).should('be.visible');
  cy.get('[data-testid="icon:close"]').click();
});
})
