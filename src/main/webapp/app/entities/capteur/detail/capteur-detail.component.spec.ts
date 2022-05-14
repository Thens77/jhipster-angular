import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CapteurDetailComponent } from './capteur-detail.component';

describe('Capteur Management Detail Component', () => {
  let comp: CapteurDetailComponent;
  let fixture: ComponentFixture<CapteurDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CapteurDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ capteur: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CapteurDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CapteurDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load capteur on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.capteur).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
