import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IExtraUser, ExtraUser } from '../extra-user.model';

import { ExtraUserService } from './extra-user.service';

describe('ExtraUser Service', () => {
  let service: ExtraUserService;
  let httpMock: HttpTestingController;
  let elemDefault: IExtraUser;
  let expectedResult: IExtraUser | IExtraUser[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExtraUserService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      role: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ExtraUser', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ExtraUser()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExtraUser', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          role: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExtraUser', () => {
      const patchObject = Object.assign({}, new ExtraUser());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExtraUser', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          role: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ExtraUser', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addExtraUserToCollectionIfMissing', () => {
      it('should add a ExtraUser to an empty array', () => {
        const extraUser: IExtraUser = { id: 123 };
        expectedResult = service.addExtraUserToCollectionIfMissing([], extraUser);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(extraUser);
      });

      it('should not add a ExtraUser to an array that contains it', () => {
        const extraUser: IExtraUser = { id: 123 };
        const extraUserCollection: IExtraUser[] = [
          {
            ...extraUser,
          },
          { id: 456 },
        ];
        expectedResult = service.addExtraUserToCollectionIfMissing(extraUserCollection, extraUser);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExtraUser to an array that doesn't contain it", () => {
        const extraUser: IExtraUser = { id: 123 };
        const extraUserCollection: IExtraUser[] = [{ id: 456 }];
        expectedResult = service.addExtraUserToCollectionIfMissing(extraUserCollection, extraUser);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(extraUser);
      });

      it('should add only unique ExtraUser to an array', () => {
        const extraUserArray: IExtraUser[] = [{ id: 123 }, { id: 456 }, { id: 64428 }];
        const extraUserCollection: IExtraUser[] = [{ id: 123 }];
        expectedResult = service.addExtraUserToCollectionIfMissing(extraUserCollection, ...extraUserArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const extraUser: IExtraUser = { id: 123 };
        const extraUser2: IExtraUser = { id: 456 };
        expectedResult = service.addExtraUserToCollectionIfMissing([], extraUser, extraUser2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(extraUser);
        expect(expectedResult).toContain(extraUser2);
      });

      it('should accept null and undefined values', () => {
        const extraUser: IExtraUser = { id: 123 };
        expectedResult = service.addExtraUserToCollectionIfMissing([], null, extraUser, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(extraUser);
      });

      it('should return initial array if no ExtraUser is added', () => {
        const extraUserCollection: IExtraUser[] = [{ id: 123 }];
        expectedResult = service.addExtraUserToCollectionIfMissing(extraUserCollection, undefined, null);
        expect(expectedResult).toEqual(extraUserCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
