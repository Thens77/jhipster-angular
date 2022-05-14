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

describe('Capteur e2e test', () => {
  const capteurPageUrl = '/capteur';
  const capteurPageUrlPattern = new RegExp('/capteur(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const capteurSample = {};

  let capteur: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/capteurs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/capteurs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/capteurs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (capteur) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/capteurs/${capteur.id}`,
      }).then(() => {
        capteur = undefined;
      });
    }
  });

  it('Capteurs menu should load Capteurs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('capteur');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Capteur').should('exist');
    cy.url().should('match', capteurPageUrlPattern);
  });

  describe('Capteur page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(capteurPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Capteur page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/capteur/new$'));
        cy.getEntityCreateUpdateHeading('Capteur');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', capteurPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/capteurs',
          body: capteurSample,
        }).then(({ body }) => {
          capteur = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/capteurs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [capteur],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(capteurPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Capteur page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('capteur');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', capteurPageUrlPattern);
      });

      it('edit button click should load edit Capteur page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Capteur');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', capteurPageUrlPattern);
      });

      it('last delete button click should delete instance of Capteur', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('capteur').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', capteurPageUrlPattern);

        capteur = undefined;
      });
    });
  });

  describe('new Capteur page', () => {
    beforeEach(() => {
      cy.visit(`${capteurPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Capteur');
    });

    it('should create an instance of Capteur', () => {
      cy.get(`[data-cy="type"]`).type('Borders').should('have.value', 'Borders');

      cy.get(`[data-cy="reference"]`).type('Sports calculate Movies').should('have.value', 'Sports calculate Movies');

      cy.get(`[data-cy="photo"]`).type('alarm Account').should('have.value', 'alarm Account');

      cy.get(`[data-cy="frequence"]`).type('98568').should('have.value', '98568');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        capteur = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', capteurPageUrlPattern);
    });
  });
});
