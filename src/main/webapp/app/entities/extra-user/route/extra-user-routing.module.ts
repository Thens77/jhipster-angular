import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExtraUserComponent } from '../list/extra-user.component';
import { ExtraUserDetailComponent } from '../detail/extra-user-detail.component';
import { ExtraUserUpdateComponent } from '../update/extra-user-update.component';
import { ExtraUserRoutingResolveService } from './extra-user-routing-resolve.service';

const extraUserRoute: Routes = [
  {
    path: '',
    component: ExtraUserComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExtraUserDetailComponent,
    resolve: {
      extraUser: ExtraUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExtraUserUpdateComponent,
    resolve: {
      extraUser: ExtraUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExtraUserUpdateComponent,
    resolve: {
      extraUser: ExtraUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(extraUserRoute)],
  exports: [RouterModule],
})
export class ExtraUserRoutingModule {}
