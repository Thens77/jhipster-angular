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

describe('Grandeur e2e test', () => {
  const grandeurPageUrl = '/grandeur';
  const grandeurPageUrlPattern = new RegExp('/grandeur(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const grandeurSample = {};

  let grandeur: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/grandeurs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/grandeurs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/grandeurs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (grandeur) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/grandeurs/${grandeur.id}`,
      }).then(() => {
        grandeur = undefined;
      });
    }
  });

  it('Grandeurs menu should load Grandeurs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('grandeur');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Grandeur').should('exist');
    cy.url().should('match', grandeurPageUrlPattern);
  });

  describe('Grandeur page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(grandeurPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Grandeur page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/grandeur/new$'));
        cy.getEntityCreateUpdateHeading('Grandeur');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', grandeurPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/grandeurs',
          body: grandeurSample,
        }).then(({ body }) => {
          grandeur = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/grandeurs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [grandeur],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(grandeurPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Grandeur page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('grandeur');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', grandeurPageUrlPattern);
      });

      it('edit button click should load edit Grandeur page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Grandeur');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', grandeurPageUrlPattern);
      });

      it('last delete button click should delete instance of Grandeur', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('grandeur').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', grandeurPageUrlPattern);

        grandeur = undefined;
      });
    });
  });

  describe('new Grandeur page', () => {
    beforeEach(() => {
      cy.visit(`${grandeurPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Grandeur');
    });

    it('should create an instance of Grandeur', () => {
      cy.get(`[data-cy="type"]`).type('Practical Buckinghamshire').should('have.value', 'Practical Buckinghamshire');

      cy.get(`[data-cy="valeur"]`).type('Berkshire Checking').should('have.value', 'Berkshire Checking');

      cy.get(`[data-cy="date"]`).type('2022-05-04').should('have.value', '2022-05-04');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        grandeur = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', grandeurPageUrlPattern);
    });
  });
});
