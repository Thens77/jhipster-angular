import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICapteur } from '../capteur.model';

@Component({
  selector: 'jhi-capteur-detail',
  templateUrl: './capteur-detail.component.html',
})
export class CapteurDetailComponent implements OnInit {
  capteur: ICapteur | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ capteur }) => {
      this.capteur = capteur;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
