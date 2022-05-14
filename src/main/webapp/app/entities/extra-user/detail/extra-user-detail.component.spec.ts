import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExtraUserDetailComponent } from './extra-user-detail.component';

describe('ExtraUser Management Detail Component', () => {
  let comp: ExtraUserDetailComponent;
  let fixture: ComponentFixture<ExtraUserDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtraUserDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ extraUser: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExtraUserDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExtraUserDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load extraUser on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.extraUser).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
