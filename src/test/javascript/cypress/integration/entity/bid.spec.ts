import { entityItemSelector } from '../../support/commands'
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
} from '../../support/entity'

describe('Bid e2e test', () => {
  const bidPageUrl = '/meus-lances'
  const bidPageUrlPattern = new RegExp('/bid(\\?.*)?$')
  const username = Cypress.env('E2E_USERNAME') ?? 'admin'
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin'

  before(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    })
    cy.visit('')
    cy.login(username, password)
    cy.get(entityItemSelector).should('exist')
  })

  beforeEach(() => {
    cy.intercept('GET', '/api/bids+(?*|)').as('entitiesRequest')
    cy.intercept('POST', '/api/bids').as('postEntityRequest')
    cy.intercept('DELETE', '/api/bids/*').as('deleteEntityRequest')
  })

  it('should load Bids', () => {
    cy.visit('/')
    cy.clickOnEntityMenuItem('bid')
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist')
      } else {
        cy.get(entityTableSelector).should('exist')
      }
    })
    cy.getEntityHeading('Bid').should('exist')
    cy.url().should('match', bidPageUrlPattern)
  })

  it('should load details Bid page', function () {
    cy.visit(bidPageUrl)
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip()
      }
    })
    cy.get(entityDetailsButtonSelector).first().click({ force: true })
    cy.getEntityDetailsHeading('bid')
    cy.get(entityDetailsBackButtonSelector).click({ force: true })
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200)
    })
    cy.url().should('match', bidPageUrlPattern)
  })

  it('should load create Bid page', () => {
    cy.visit(bidPageUrl)
    cy.wait('@entitiesRequest')
    cy.get(entityCreateButtonSelector).click({ force: true })
    cy.getEntityCreateUpdateHeading('Bid')
    cy.get(entityCreateSaveButtonSelector).should('exist')
    cy.get(entityCreateCancelButtonSelector).click({ force: true })
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200)
    })
    cy.url().should('match', bidPageUrlPattern)
  })

  it('should load edit Bid page', function () {
    cy.visit(bidPageUrl)
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip()
      }
    })
    cy.get(entityEditButtonSelector).first().click({ force: true })
    cy.getEntityCreateUpdateHeading('Bid')
    cy.get(entityCreateSaveButtonSelector).should('exist')
    cy.get(entityCreateCancelButtonSelector).click({ force: true })
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200)
    })
    cy.url().should('match', bidPageUrlPattern)
  })

  it('should create an instance of Bid', () => {
    cy.visit(bidPageUrl)
    cy.get(entityCreateButtonSelector).click({ force: true })
    cy.getEntityCreateUpdateHeading('Bid')

    cy.get(`[data-cy="value"]`).type('9643').should('have.value', '9643')

    cy.get(`[data-cy="created"]`).type('2024-02-08T07:40').should('have.value', '2024-02-08T07:40')

    cy.setFieldSelectToLastOfEntity('user')

    cy.setFieldSelectToLastOfEntity('consortium')

    cy.get(entityCreateSaveButtonSelector).click({ force: true })
    cy.scrollTo('top', { ensureScrollable: false })
    cy.get(entityCreateSaveButtonSelector).should('not.exist')
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201)
    })
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200)
    })
    cy.url().should('match', bidPageUrlPattern)
  })

  it('should delete last instance of Bid', function () {
    cy.intercept('GET', '/api/bids/*').as('dialogDeleteRequest')
    cy.visit(bidPageUrl)
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length)
        cy.get(entityDeleteButtonSelector).last().click({ force: true })
        cy.wait('@dialogDeleteRequest')
        cy.getEntityDeleteDialogHeading('bid').should('exist')
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true })
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204)
        })
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200)
        })
        cy.url().should('match', bidPageUrlPattern)
      } else {
        this.skip()
      }
    })
  })
})
