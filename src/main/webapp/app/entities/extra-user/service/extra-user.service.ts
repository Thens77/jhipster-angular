import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExtraUser, getExtraUserIdentifier } from '../extra-user.model';

export type EntityResponseType = HttpResponse<IExtraUser>;
export type EntityArrayResponseType = HttpResponse<IExtraUser[]>;

@Injectable({ providedIn: 'root' })
export class ExtraUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/extra-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(extraUser: IExtraUser): Observable<EntityResponseType> {
    return this.http.post<IExtraUser>(this.resourceUrl, extraUser, { observe: 'response' });
  }

  update(extraUser: IExtraUser): Observable<EntityResponseType> {
    return this.http.put<IExtraUser>(`${this.resourceUrl}/${getExtraUserIdentifier(extraUser) as number}`, extraUser, {
      observe: 'response',
    });
  }

  partialUpdate(extraUser: IExtraUser): Observable<EntityResponseType> {
    return this.http.patch<IExtraUser>(`${this.resourceUrl}/${getExtraUserIdentifier(extraUser) as number}`, extraUser, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExtraUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExtraUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExtraUserToCollectionIfMissing(
    extraUserCollection: IExtraUser[],
    ...extraUsersToCheck: (IExtraUser | null | undefined)[]
  ): IExtraUser[] {
    const extraUsers: IExtraUser[] = extraUsersToCheck.filter(isPresent);
    if (extraUsers.length > 0) {
      const extraUserCollectionIdentifiers = extraUserCollection.map(extraUserItem => getExtraUserIdentifier(extraUserItem)!);
      const extraUsersToAdd = extraUsers.filter(extraUserItem => {
        const extraUserIdentifier = getExtraUserIdentifier(extraUserItem);
        if (extraUserIdentifier == null || extraUserCollectionIdentifiers.includes(extraUserIdentifier)) {
          return false;
        }
        extraUserCollectionIdentifiers.push(extraUserIdentifier);
        return true;
      });
      return [...extraUsersToAdd, ...extraUserCollection];
    }
    return extraUserCollection;
  }
}
