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

describe('Arrosage e2e test', () => {
  const arrosagePageUrl = '/arrosage';
  const arrosagePageUrlPattern = new RegExp('/arrosage(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const arrosageSample = {};

  let arrosage: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/arrosages+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/arrosages').as('postEntityRequest');
    cy.intercept('DELETE', '/api/arrosages/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (arrosage) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/arrosages/${arrosage.id}`,
      }).then(() => {
        arrosage = undefined;
      });
    }
  });

  it('Arrosages menu should load Arrosages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('arrosage');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Arrosage').should('exist');
    cy.url().should('match', arrosagePageUrlPattern);
  });

  describe('Arrosage page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(arrosagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Arrosage page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/arrosage/new$'));
        cy.getEntityCreateUpdateHeading('Arrosage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', arrosagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/arrosages',
          body: arrosageSample,
        }).then(({ body }) => {
          arrosage = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/arrosages+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [arrosage],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(arrosagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Arrosage page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('arrosage');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', arrosagePageUrlPattern);
      });

      it('edit button click should load edit Arrosage page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Arrosage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', arrosagePageUrlPattern);
      });

      it('last delete button click should delete instance of Arrosage', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('arrosage').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', arrosagePageUrlPattern);

        arrosage = undefined;
      });
    });
  });

  describe('new Arrosage page', () => {
    beforeEach(() => {
      cy.visit(`${arrosagePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Arrosage');
    });

    it('should create an instance of Arrosage', () => {
      cy.get(`[data-cy="date"]`).type('2022-05-04').should('have.value', '2022-05-04');

      cy.get(`[data-cy="duree"]`).type('22649').should('have.value', '22649');

      cy.get(`[data-cy="quantiteEau"]`).type('24365').should('have.value', '24365');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        arrosage = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', arrosagePageUrlPattern);
    });
  });
});
