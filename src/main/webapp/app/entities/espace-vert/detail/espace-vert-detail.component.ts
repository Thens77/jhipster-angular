import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEspaceVert } from '../espace-vert.model';

@Component({
  selector: 'jhi-espace-vert-detail',
  templateUrl: './espace-vert-detail.component.html',
})
export class EspaceVertDetailComponent implements OnInit {
  espaceVert: IEspaceVert | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ espaceVert }) => {
      this.espaceVert = espaceVert;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
