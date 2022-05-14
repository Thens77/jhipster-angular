import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IUtilisateur, Utilisateur } from '../utilisateur.model';
import { UtilisateurService } from '../service/utilisateur.service';

@Component({
  selector: 'jhi-utilisateur-update',
  templateUrl: './utilisateur-update.component.html',
})
export class UtilisateurUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nom: [],
    prenom: [],
    photo: [],
    password: [],
    email: [],
  });

  constructor(protected utilisateurService: UtilisateurService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ utilisateur }) => {
      this.updateForm(utilisateur);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const utilisateur = this.createFromForm();
    if (utilisateur.id !== undefined) {
      this.subscribeToSaveResponse(this.utilisateurService.update(utilisateur));
    } else {
      this.subscribeToSaveResponse(this.utilisateurService.create(utilisateur));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUtilisateur>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(utilisateur: IUtilisateur): void {
    this.editForm.patchValue({
      id: utilisateur.id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      photo: utilisateur.photo,
      password: utilisateur.password,
      email: utilisateur.email,
    });
  }

  protected createFromForm(): IUtilisateur {
    return {
      ...new Utilisateur(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      password: this.editForm.get(['password'])!.value,
      email: this.editForm.get(['email'])!.value,
    };
  }
}
