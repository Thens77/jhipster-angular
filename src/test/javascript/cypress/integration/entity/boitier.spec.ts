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

describe('Boitier e2e test', () => {
  const boitierPageUrl = '/boitier';
  const boitierPageUrlPattern = new RegExp('/boitier(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const boitierSample = {};

  let boitier: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/boitiers+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/boitiers').as('postEntityRequest');
    cy.intercept('DELETE', '/api/boitiers/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (boitier) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/boitiers/${boitier.id}`,
      }).then(() => {
        boitier = undefined;
      });
    }
  });

  it('Boitiers menu should load Boitiers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('boitier');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Boitier').should('exist');
    cy.url().should('match', boitierPageUrlPattern);
  });

  describe('Boitier page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(boitierPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Boitier page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/boitier/new$'));
        cy.getEntityCreateUpdateHeading('Boitier');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', boitierPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/boitiers',
          body: boitierSample,
        }).then(({ body }) => {
          boitier = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/boitiers+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [boitier],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(boitierPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Boitier page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('boitier');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', boitierPageUrlPattern);
      });

      it('edit button click should load edit Boitier page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Boitier');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', boitierPageUrlPattern);
      });

      it('last delete button click should delete instance of Boitier', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('boitier').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', boitierPageUrlPattern);

        boitier = undefined;
      });
    });
  });

  describe('new Boitier page', () => {
    beforeEach(() => {
      cy.visit(`${boitierPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Boitier');
    });

    it('should create an instance of Boitier', () => {
      cy.get(`[data-cy="refrence"]`).type('JSON Administrator').should('have.value', 'JSON Administrator');

      cy.get(`[data-cy="nbrBranche"]`).type('68669').should('have.value', '68669');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        boitier = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', boitierPageUrlPattern);
    });
  });
});
