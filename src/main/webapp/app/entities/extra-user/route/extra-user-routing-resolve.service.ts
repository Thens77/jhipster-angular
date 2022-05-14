import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExtraUser, ExtraUser } from '../extra-user.model';
import { ExtraUserService } from '../service/extra-user.service';

@Injectable({ providedIn: 'root' })
export class ExtraUserRoutingResolveService implements Resolve<IExtraUser> {
  constructor(protected service: ExtraUserService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExtraUser> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((extraUser: HttpResponse<ExtraUser>) => {
          if (extraUser.body) {
            return of(extraUser.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ExtraUser());
  }
}
