import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IZone } from '../zone.model';
import { ZoneService } from '../service/zone.service';
import { ZoneDeleteDialogComponent } from '../delete/zone-delete-dialog.component';

@Component({
  selector: 'jhi-zone',
  templateUrl: './zone.component.html',
})
export class ZoneComponent implements OnInit {
  zones?: IZone[];
  isLoading = false;

  constructor(protected zoneService: ZoneService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.zoneService.query().subscribe({
      next: (res: HttpResponse<IZone[]>) => {
        this.isLoading = false;
        this.zones = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IZone): number {
    return item.id!;
  }

  delete(zone: IZone): void {
    const modalRef = this.modalService.open(ZoneDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.zone = zone;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
