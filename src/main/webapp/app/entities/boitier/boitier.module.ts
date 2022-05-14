import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BoitierComponent } from './list/boitier.component';
import { BoitierDetailComponent } from './detail/boitier-detail.component';
import { BoitierUpdateComponent } from './update/boitier-update.component';
import { BoitierDeleteDialogComponent } from './delete/boitier-delete-dialog.component';
import { InstallationUpdateComponent } from 'app/entities/installation/update/installation-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BoitierRoutingModule } from './route/boitier-routing.module';
import { InstallationRoutingModule } from 'app/entities/installation/route/installation-routing.module';

@NgModule({
  imports: [SharedModule, BoitierRoutingModule ,ReactiveFormsModule,InstallationRoutingModule],
  declarations: [BoitierComponent, BoitierDetailComponent, BoitierUpdateComponent, BoitierDeleteDialogComponent ,InstallationUpdateComponent],
  entryComponents: [BoitierDeleteDialogComponent],
})
export class BoitierModule {}
