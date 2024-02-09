import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('ConsortiumAdministrator e2e test', () => {
  const consortiumAdministratorPageUrl = '/consortium-administrator';
  const consortiumAdministratorPageUrlPattern = new RegExp('/consortium-administrator(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/consortium-administrators+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/consortium-administrators').as('postEntityRequest');
    cy.intercept('DELETE', '/api/consortium-administrators/*').as('deleteEntityRequest');
  });

  it('should load ConsortiumAdministrators', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('consortium-administrator');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ConsortiumAdministrator').should('exist');
    cy.url().should('match', consortiumAdministratorPageUrlPattern);
  });

  it('should load details ConsortiumAdministrator page', function () {
    cy.visit(consortiumAdministratorPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('consortiumAdministrator');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', consortiumAdministratorPageUrlPattern);
  });

  it('should load create ConsortiumAdministrator page', () => {
    cy.visit(consortiumAdministratorPageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('ConsortiumAdministrator');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', consortiumAdministratorPageUrlPattern);
  });

  it('should load edit ConsortiumAdministrator page', function () {
    cy.visit(consortiumAdministratorPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('ConsortiumAdministrator');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', consortiumAdministratorPageUrlPattern);
  });

  it('should create an instance of ConsortiumAdministrator', () => {
    cy.visit(consortiumAdministratorPageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('ConsortiumAdministrator');

    cy.get(`[data-cy="name"]`).type('Fall').should('have.value', 'Fall');

    cy.setFieldImageAsBytesOfEntity('image', 'integration-test.png', 'image/png');

    // since cypress clicks submit too fast before the blob fields are validated
    cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', consortiumAdministratorPageUrlPattern);
  });

  it('should delete last instance of ConsortiumAdministrator', function () {
    cy.intercept('GET', '/api/consortium-administrators/*').as('dialogDeleteRequest');
    cy.visit(consortiumAdministratorPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('consortiumAdministrator').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', consortiumAdministratorPageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
