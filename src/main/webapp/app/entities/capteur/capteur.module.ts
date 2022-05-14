import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CapteurComponent } from './list/capteur.component';
import { CapteurDetailComponent } from './detail/capteur-detail.component';
import { CapteurUpdateComponent } from './update/capteur-update.component';
import { CapteurDeleteDialogComponent } from './delete/capteur-delete-dialog.component';
import { CapteurRoutingModule } from './route/capteur-routing.module';

@NgModule({
  imports: [SharedModule, CapteurRoutingModule],
  declarations: [CapteurComponent, CapteurDetailComponent, CapteurUpdateComponent, CapteurDeleteDialogComponent],
  entryComponents: [CapteurDeleteDialogComponent],
})
export class CapteurModule {}
