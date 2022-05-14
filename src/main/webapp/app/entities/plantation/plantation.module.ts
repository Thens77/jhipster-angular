import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PlantationComponent } from './list/plantation.component';
import { PlantationDetailComponent } from './detail/plantation-detail.component';
import { PlantationUpdateComponent } from './update/plantation-update.component';
import { PlantationDeleteDialogComponent } from './delete/plantation-delete-dialog.component';
import { PlantationRoutingModule } from './route/plantation-routing.module';

@NgModule({
  imports: [SharedModule, PlantationRoutingModule],
  declarations: [PlantationComponent, PlantationDetailComponent, PlantationUpdateComponent, PlantationDeleteDialogComponent],
  entryComponents: [PlantationDeleteDialogComponent],
})
export class PlantationModule {}
