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

describe('Connecte e2e test', () => {
  const connectePageUrl = '/connecte';
  const connectePageUrlPattern = new RegExp('/connecte(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const connecteSample = {};

  let connecte: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/connectes+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/connectes').as('postEntityRequest');
    cy.intercept('DELETE', '/api/connectes/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (connecte) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/connectes/${connecte.id}`,
      }).then(() => {
        connecte = undefined;
      });
    }
  });

  it('Connectes menu should load Connectes page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('connecte');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Connecte').should('exist');
    cy.url().should('match', connectePageUrlPattern);
  });

  describe('Connecte page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(connectePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Connecte page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/connecte/new$'));
        cy.getEntityCreateUpdateHeading('Connecte');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', connectePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/connectes',
          body: connecteSample,
        }).then(({ body }) => {
          connecte = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/connectes+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [connecte],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(connectePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Connecte page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('connecte');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', connectePageUrlPattern);
      });

      it('edit button click should load edit Connecte page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Connecte');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', connectePageUrlPattern);
      });

      it('last delete button click should delete instance of Connecte', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('connecte').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', connectePageUrlPattern);

        connecte = undefined;
      });
    });
  });

  describe('new Connecte page', () => {
    beforeEach(() => {
      cy.visit(`${connectePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Connecte');
    });

    it('should create an instance of Connecte', () => {
      cy.get(`[data-cy="fonctionnel"]`).should('not.be.checked');
      cy.get(`[data-cy="fonctionnel"]`).click().should('be.checked');

      cy.get(`[data-cy="branche"]`).type('Islands calculating Utah').should('have.value', 'Islands calculating Utah');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        connecte = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', connectePageUrlPattern);
    });
  });
});
