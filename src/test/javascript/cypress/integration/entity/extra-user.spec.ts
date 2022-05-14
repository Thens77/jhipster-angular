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

describe('ExtraUser e2e test', () => {
  const extraUserPageUrl = '/extra-user';
  const extraUserPageUrlPattern = new RegExp('/extra-user(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const extraUserSample = {};

  let extraUser: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/extra-users+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/extra-users').as('postEntityRequest');
    cy.intercept('DELETE', '/api/extra-users/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (extraUser) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/extra-users/${extraUser.id}`,
      }).then(() => {
        extraUser = undefined;
      });
    }
  });

  it('ExtraUsers menu should load ExtraUsers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('extra-user');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ExtraUser').should('exist');
    cy.url().should('match', extraUserPageUrlPattern);
  });

  describe('ExtraUser page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(extraUserPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ExtraUser page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/extra-user/new$'));
        cy.getEntityCreateUpdateHeading('ExtraUser');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', extraUserPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/extra-users',
          body: extraUserSample,
        }).then(({ body }) => {
          extraUser = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/extra-users+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [extraUser],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(extraUserPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ExtraUser page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('extraUser');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', extraUserPageUrlPattern);
      });

      it('edit button click should load edit ExtraUser page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ExtraUser');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', extraUserPageUrlPattern);
      });

      it('last delete button click should delete instance of ExtraUser', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('extraUser').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', extraUserPageUrlPattern);

        extraUser = undefined;
      });
    });
  });

  describe('new ExtraUser page', () => {
    beforeEach(() => {
      cy.visit(`${extraUserPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ExtraUser');
    });

    it('should create an instance of ExtraUser', () => {
      cy.get(`[data-cy="role"]`).type('Buckinghamshire').should('have.value', 'Buckinghamshire');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        extraUser = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', extraUserPageUrlPattern);
    });
  });
});
