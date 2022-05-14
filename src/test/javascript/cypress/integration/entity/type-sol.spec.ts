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

describe('TypeSol e2e test', () => {
  const typeSolPageUrl = '/type-sol';
  const typeSolPageUrlPattern = new RegExp('/type-sol(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const typeSolSample = {};

  let typeSol: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/type-sols+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/type-sols').as('postEntityRequest');
    cy.intercept('DELETE', '/api/type-sols/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (typeSol) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/type-sols/${typeSol.id}`,
      }).then(() => {
        typeSol = undefined;
      });
    }
  });

  it('TypeSols menu should load TypeSols page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('type-sol');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TypeSol').should('exist');
    cy.url().should('match', typeSolPageUrlPattern);
  });

  describe('TypeSol page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(typeSolPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TypeSol page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/type-sol/new$'));
        cy.getEntityCreateUpdateHeading('TypeSol');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', typeSolPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/type-sols',
          body: typeSolSample,
        }).then(({ body }) => {
          typeSol = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/type-sols+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [typeSol],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(typeSolPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TypeSol page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('typeSol');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', typeSolPageUrlPattern);
      });

      it('edit button click should load edit TypeSol page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TypeSol');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', typeSolPageUrlPattern);
      });

      it('last delete button click should delete instance of TypeSol', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('typeSol').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', typeSolPageUrlPattern);

        typeSol = undefined;
      });
    });
  });

  describe('new TypeSol page', () => {
    beforeEach(() => {
      cy.visit(`${typeSolPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TypeSol');
    });

    it('should create an instance of TypeSol', () => {
      cy.get(`[data-cy="libelle"]`).type('Corporate').should('have.value', 'Corporate');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        typeSol = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', typeSolPageUrlPattern);
    });
  });
});
