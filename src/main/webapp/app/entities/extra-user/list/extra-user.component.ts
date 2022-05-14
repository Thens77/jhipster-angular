import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IExtraUser } from '../extra-user.model';
import { ExtraUserService } from '../service/extra-user.service';
import { ExtraUserDeleteDialogComponent } from '../delete/extra-user-delete-dialog.component';

@Component({
  selector: 'jhi-extra-user',
  templateUrl: './extra-user.component.html',
})
export class ExtraUserComponent implements OnInit {
  extraUsers?: IExtraUser[];
  isLoading = false;

  constructor(protected extraUserService: ExtraUserService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.extraUserService.query().subscribe({
      next: (res: HttpResponse<IExtraUser[]>) => {
        this.isLoading = false;
        this.extraUsers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IExtraUser): number {
    return item.id!;
  }

  delete(extraUser: IExtraUser): void {
    const modalRef = this.modalService.open(ExtraUserDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.extraUser = extraUser;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
