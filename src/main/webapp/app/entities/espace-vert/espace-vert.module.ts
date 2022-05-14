import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EspaceVertComponent } from './list/espace-vert.component';
import { EspaceVertDetailComponent } from './detail/espace-vert-detail.component';
import { EspaceVertUpdateComponent } from './update/espace-vert-update.component';
import { EspaceVertDeleteDialogComponent } from './delete/espace-vert-delete-dialog.component';
import { EspaceVertRoutingModule } from './route/espace-vert-routing.module';

@NgModule({
  imports: [SharedModule, EspaceVertRoutingModule],
  declarations: [EspaceVertComponent ,EspaceVertDetailComponent, EspaceVertUpdateComponent, EspaceVertDeleteDialogComponent ],
  entryComponents: [EspaceVertDeleteDialogComponent],
})
export class EspaceVertModule {}
