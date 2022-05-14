import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExtraUserComponent } from './list/extra-user.component';
import { ExtraUserDetailComponent } from './detail/extra-user-detail.component';
import { ExtraUserUpdateComponent } from './update/extra-user-update.component';
import { ExtraUserDeleteDialogComponent } from './delete/extra-user-delete-dialog.component';
import { ExtraUserRoutingModule } from './route/extra-user-routing.module';

@NgModule({
  imports: [SharedModule, ExtraUserRoutingModule],
  declarations: [ExtraUserComponent, ExtraUserDetailComponent, ExtraUserUpdateComponent, ExtraUserDeleteDialogComponent],
  entryComponents: [ExtraUserDeleteDialogComponent],
})
export class ExtraUserModule {}
