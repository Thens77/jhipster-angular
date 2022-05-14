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

describe('Installation e2e test', () => {
  const installationPageUrl = '/installation';
  const installationPageUrlPattern = new RegExp('/installation(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const installationSample = {};

  let installation: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/installations+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/installations').as('postEntityRequest');
    cy.intercept('DELETE', '/api/installations/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (installation) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/installations/${installation.id}`,
      }).then(() => {
        installation = undefined;
      });
    }
  });

  it('Installations menu should load Installations page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('installation');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Installation').should('exist');
    cy.url().should('match', installationPageUrlPattern);
  });

  describe('Installation page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(installationPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Installation page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/installation/new$'));
        cy.getEntityCreateUpdateHeading('Installation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', installationPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/installations',
          body: installationSample,
        }).then(({ body }) => {
          installation = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/installations+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [installation],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(installationPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Installation page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('installation');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', installationPageUrlPattern);
      });

      it('edit button click should load edit Installation page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Installation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', installationPageUrlPattern);
      });

      it('last delete button click should delete instance of Installation', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('installation').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', installationPageUrlPattern);

        installation = undefined;
      });
    });
  });

  describe('new Installation page', () => {
    beforeEach(() => {
      cy.visit(`${installationPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Installation');
    });

    it('should create an instance of Installation', () => {
      cy.get(`[data-cy="dateDebut"]`).type('2022-05-04').should('have.value', '2022-05-04');

      cy.get(`[data-cy="dateFin"]`).type('2022-05-04').should('have.value', '2022-05-04');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        installation = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', installationPageUrlPattern);
    });
  });
});
