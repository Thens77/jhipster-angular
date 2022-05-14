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

describe('Plantation e2e test', () => {
  const plantationPageUrl = '/plantation';
  const plantationPageUrlPattern = new RegExp('/plantation(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const plantationSample = {};

  let plantation: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/plantations+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/plantations').as('postEntityRequest');
    cy.intercept('DELETE', '/api/plantations/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (plantation) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/plantations/${plantation.id}`,
      }).then(() => {
        plantation = undefined;
      });
    }
  });

  it('Plantations menu should load Plantations page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('plantation');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Plantation').should('exist');
    cy.url().should('match', plantationPageUrlPattern);
  });

  describe('Plantation page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(plantationPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Plantation page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/plantation/new$'));
        cy.getEntityCreateUpdateHeading('Plantation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', plantationPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/plantations',
          body: plantationSample,
        }).then(({ body }) => {
          plantation = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/plantations+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [plantation],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(plantationPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Plantation page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('plantation');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', plantationPageUrlPattern);
      });

      it('edit button click should load edit Plantation page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Plantation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', plantationPageUrlPattern);
      });

      it('last delete button click should delete instance of Plantation', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('plantation').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', plantationPageUrlPattern);

        plantation = undefined;
      });
    });
  });

  describe('new Plantation page', () => {
    beforeEach(() => {
      cy.visit(`${plantationPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Plantation');
    });

    it('should create an instance of Plantation', () => {
      cy.get(`[data-cy="date"]`).type('2022-05-04').should('have.value', '2022-05-04');

      cy.get(`[data-cy="nbrPlante"]`).type('18617').should('have.value', '18617');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        plantation = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', plantationPageUrlPattern);
    });
  });
});
