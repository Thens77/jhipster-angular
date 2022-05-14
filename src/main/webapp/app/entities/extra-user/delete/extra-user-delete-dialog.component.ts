import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExtraUser } from '../extra-user.model';
import { ExtraUserService } from '../service/extra-user.service';

@Component({
  templateUrl: './extra-user-delete-dialog.component.html',
})
export class ExtraUserDeleteDialogComponent {
  extraUser?: IExtraUser;

  constructor(protected extraUserService: ExtraUserService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.extraUserService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
