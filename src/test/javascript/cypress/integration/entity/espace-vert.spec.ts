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

describe('EspaceVert e2e test', () => {
  const espaceVertPageUrl = '/espace-vert';
  const espaceVertPageUrlPattern = new RegExp('/espace-vert(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const espaceVertSample = {};

  let espaceVert: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/espace-verts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/espace-verts').as('postEntityRequest');
    cy.intercept('DELETE', '/api/espace-verts/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (espaceVert) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/espace-verts/${espaceVert.id}`,
      }).then(() => {
        espaceVert = undefined;
      });
    }
  });

  it('EspaceVerts menu should load EspaceVerts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('espace-vert');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('EspaceVert').should('exist');
    cy.url().should('match', espaceVertPageUrlPattern);
  });

  describe('EspaceVert page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(espaceVertPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create EspaceVert page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/espace-vert/new$'));
        cy.getEntityCreateUpdateHeading('EspaceVert');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', espaceVertPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/espace-verts',
          body: espaceVertSample,
        }).then(({ body }) => {
          espaceVert = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/espace-verts+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [espaceVert],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(espaceVertPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details EspaceVert page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('espaceVert');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', espaceVertPageUrlPattern);
      });

      it('edit button click should load edit EspaceVert page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EspaceVert');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', espaceVertPageUrlPattern);
      });

      it('last delete button click should delete instance of EspaceVert', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('espaceVert').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', espaceVertPageUrlPattern);

        espaceVert = undefined;
      });
    });
  });

  describe('new EspaceVert page', () => {
    beforeEach(() => {
      cy.visit(`${espaceVertPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('EspaceVert');
    });

    it('should create an instance of EspaceVert', () => {
      cy.get(`[data-cy="libelle"]`).type('Car').should('have.value', 'Car');

      cy.get(`[data-cy="photo"]`).type('THX Avon').should('have.value', 'THX Avon');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        espaceVert = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', espaceVertPageUrlPattern);
    });
  });
});
