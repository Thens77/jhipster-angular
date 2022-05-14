import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GrandeurComponent } from './list/grandeur.component';
import { GrandeurDetailComponent } from './detail/grandeur-detail.component';
import { GrandeurUpdateComponent } from './update/grandeur-update.component';
import { GrandeurDeleteDialogComponent } from './delete/grandeur-delete-dialog.component';
import { GrandeurRoutingModule } from './route/grandeur-routing.module';

@NgModule({
  imports: [SharedModule, GrandeurRoutingModule],
  declarations: [GrandeurComponent, GrandeurDetailComponent, GrandeurUpdateComponent, GrandeurDeleteDialogComponent],
  entryComponents: [GrandeurDeleteDialogComponent],
})
export class GrandeurModule {}
