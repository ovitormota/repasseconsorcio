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

describe('Consortium e2e test', () => {
  const consortiumPageUrl = '/consortium';
  const consortiumPageUrlPattern = new RegExp('/consortium(\\?.*)?$');
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
    cy.intercept('GET', '/api/consortiums+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/consortiums').as('postEntityRequest');
    cy.intercept('DELETE', '/api/consortiums/*').as('deleteEntityRequest');
  });

  it('should load Consortiums', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('consortium');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Consortium').should('exist');
    cy.url().should('match', consortiumPageUrlPattern);
  });

  it('should load details Consortium page', function () {
    cy.visit(consortiumPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('consortium');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', consortiumPageUrlPattern);
  });

  it('should load create Consortium page', () => {
    cy.visit(consortiumPageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Consortium');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', consortiumPageUrlPattern);
  });

  it('should load edit Consortium page', function () {
    cy.visit(consortiumPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('Consortium');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', consortiumPageUrlPattern);
  });

  it('should create an instance of Consortium', () => {
    cy.visit(consortiumPageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Consortium');

    cy.get(`[data-cy="consortiumValue"]`).type('21246').should('have.value', '21246');

    cy.get(`[data-cy="created"]`).type('2024-02-08T14:25').should('have.value', '2024-02-08T14:25');

    cy.get(`[data-cy="minimumBidValue"]`).type('89982').should('have.value', '89982');

    cy.get(`[data-cy="numberOfInstallments"]`).type('35383').should('have.value', '35383');

    cy.get(`[data-cy="installmentValue"]`).type('19415').should('have.value', '19415');

    cy.get(`[data-cy="segmentType"]`).select('REAL_ESTATE');

    cy.get(`[data-cy="status"]`).select('REGISTERED');

    cy.setFieldSelectToLastOfEntity('user');

    cy.setFieldSelectToLastOfEntity('consortiumAdministrator');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', consortiumPageUrlPattern);
  });

  it('should delete last instance of Consortium', function () {
    cy.intercept('GET', '/api/consortiums/*').as('dialogDeleteRequest');
    cy.visit(consortiumPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('consortium').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', consortiumPageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
