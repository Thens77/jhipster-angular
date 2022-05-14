import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InstallationComponent } from './list/installation.component';
import { InstallationDetailComponent } from './detail/installation-detail.component';

import { InstallationDeleteDialogComponent } from './delete/installation-delete-dialog.component';
import { InstallationRoutingModule } from './route/installation-routing.module';

@NgModule({
  imports: [SharedModule, InstallationRoutingModule],
  declarations: [InstallationComponent, InstallationDetailComponent, InstallationDeleteDialogComponent],
  entryComponents: [InstallationDeleteDialogComponent],
})
export class InstallationModule {}
