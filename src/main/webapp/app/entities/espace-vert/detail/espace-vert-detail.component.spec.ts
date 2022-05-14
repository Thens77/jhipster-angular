import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EspaceVertDetailComponent } from './espace-vert-detail.component';

describe('EspaceVert Management Detail Component', () => {
  let comp: EspaceVertDetailComponent;
  let fixture: ComponentFixture<EspaceVertDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspaceVertDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ espaceVert: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EspaceVertDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EspaceVertDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load espaceVert on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.espaceVert).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
