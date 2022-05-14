import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IExtraUser, ExtraUser } from '../extra-user.model';
import { ExtraUserService } from '../service/extra-user.service';
import { IUtilisateur } from 'app/entities/utilisateur/utilisateur.model';
import { UtilisateurService } from 'app/entities/utilisateur/service/utilisateur.service';

@Component({
  selector: 'jhi-extra-user-update',
  templateUrl: './extra-user-update.component.html',
})
export class ExtraUserUpdateComponent implements OnInit {
  isSaving = false;

  utilisateursCollection: IUtilisateur[] = [];

  editForm = this.fb.group({
    id: [],
    role: [],
    utilisateur: [],
  });

  constructor(
    protected extraUserService: ExtraUserService,
    protected utilisateurService: UtilisateurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ extraUser }) => {
      this.updateForm(extraUser);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const extraUser = this.createFromForm();
    if (extraUser.id !== undefined) {
      this.subscribeToSaveResponse(this.extraUserService.update(extraUser));
    } else {
      this.subscribeToSaveResponse(this.extraUserService.create(extraUser));
    }
  }

  trackUtilisateurById(_index: number, item: IUtilisateur): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExtraUser>>): void {
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

  protected updateForm(extraUser: IExtraUser): void {
    this.editForm.patchValue({
      id: extraUser.id,
      role: extraUser.role,
      utilisateur: extraUser.utilisateur,
    });

    this.utilisateursCollection = this.utilisateurService.addUtilisateurToCollectionIfMissing(
      this.utilisateursCollection,
      extraUser.utilisateur
    );
  }

  protected loadRelationshipsOptions(): void {
    this.utilisateurService
      .query({ filter: 'extrauser-is-null' })
      .pipe(map((res: HttpResponse<IUtilisateur[]>) => res.body ?? []))
      .pipe(
        map((utilisateurs: IUtilisateur[]) =>
          this.utilisateurService.addUtilisateurToCollectionIfMissing(utilisateurs, this.editForm.get('utilisateur')!.value)
        )
      )
      .subscribe((utilisateurs: IUtilisateur[]) => (this.utilisateursCollection = utilisateurs));
  }

  protected createFromForm(): IExtraUser {
    return {
      ...new ExtraUser(),
      id: this.editForm.get(['id'])!.value,
      role: this.editForm.get(['role'])!.value,
      utilisateur: this.editForm.get(['utilisateur'])!.value,
    };
  }
}
