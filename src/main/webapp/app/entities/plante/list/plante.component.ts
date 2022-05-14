import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlante } from '../plante.model';
import { PlanteService } from '../service/plante.service';
import { PlanteDeleteDialogComponent } from '../delete/plante-delete-dialog.component';

@Component({
  selector: 'jhi-plante',
  templateUrl: './plante.component.html',
})
export class PlanteComponent implements OnInit {
  plantes?: IPlante[];
  isLoading = false;

  constructor(protected planteService: PlanteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.planteService.query().subscribe({
      next: (res: HttpResponse<IPlante[]>) => {
        this.isLoading = false;
        this.plantes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPlante): number {
    return item.id!;
  }

  delete(plante: IPlante): void {
    const modalRef = this.modalService.open(PlanteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.plante = plante;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
