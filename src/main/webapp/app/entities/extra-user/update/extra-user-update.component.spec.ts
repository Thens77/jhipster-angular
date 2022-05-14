import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExtraUserService } from '../service/extra-user.service';
import { IExtraUser, ExtraUser } from '../extra-user.model';
import { IUtilisateur } from 'app/entities/utilisateur/utilisateur.model';
import { UtilisateurService } from 'app/entities/utilisateur/service/utilisateur.service';

import { ExtraUserUpdateComponent } from './extra-user-update.component';

describe('ExtraUser Management Update Component', () => {
  let comp: ExtraUserUpdateComponent;
  let fixture: ComponentFixture<ExtraUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let extraUserService: ExtraUserService;
  let utilisateurService: UtilisateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExtraUserUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ExtraUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExtraUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    extraUserService = TestBed.inject(ExtraUserService);
    utilisateurService = TestBed.inject(UtilisateurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call utilisateur query and add missing value', () => {
      const extraUser: IExtraUser = { id: 456 };
      const utilisateur: IUtilisateur = { id: 21559 };
      extraUser.utilisateur = utilisateur;

      const utilisateurCollection: IUtilisateur[] = [{ id: 79448 }];
      jest.spyOn(utilisateurService, 'query').mockReturnValue(of(new HttpResponse({ body: utilisateurCollection })));
      const expectedCollection: IUtilisateur[] = [utilisateur, ...utilisateurCollection];
      jest.spyOn(utilisateurService, 'addUtilisateurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ extraUser });
      comp.ngOnInit();

      expect(utilisateurService.query).toHaveBeenCalled();
      expect(utilisateurService.addUtilisateurToCollectionIfMissing).toHaveBeenCalledWith(utilisateurCollection, utilisateur);
      expect(comp.utilisateursCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const extraUser: IExtraUser = { id: 456 };
      const utilisateur: IUtilisateur = { id: 1283 };
      extraUser.utilisateur = utilisateur;

      activatedRoute.data = of({ extraUser });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(extraUser));
      expect(comp.utilisateursCollection).toContain(utilisateur);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExtraUser>>();
      const extraUser = { id: 123 };
      jest.spyOn(extraUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ extraUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: extraUser }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(extraUserService.update).toHaveBeenCalledWith(extraUser);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExtraUser>>();
      const extraUser = new ExtraUser();
      jest.spyOn(extraUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ extraUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: extraUser }));
      saveSubject.complete();

      // THEN
      expect(extraUserService.create).toHaveBeenCalledWith(extraUser);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExtraUser>>();
      const extraUser = { id: 123 };
      jest.spyOn(extraUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ extraUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(extraUserService.update).toHaveBeenCalledWith(extraUser);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUtilisateurById', () => {
      it('Should return tracked Utilisateur primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUtilisateurById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
