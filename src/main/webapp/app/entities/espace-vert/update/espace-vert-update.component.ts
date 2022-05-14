import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEspaceVert, EspaceVert } from '../espace-vert.model';
import { EspaceVertService } from '../service/espace-vert.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-espace-vert-update',
  templateUrl: './espace-vert-update.component.html',
})
export class EspaceVertUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    libelle: [],
    photo: [],
    user: [],
  });

  constructor(
    protected espaceVertService: EspaceVertService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ espaceVert }) => {
      this.updateForm(espaceVert);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const espaceVert = this.createFromForm();
    if (espaceVert.id !== undefined) {
      this.subscribeToSaveResponse(this.espaceVertService.update(espaceVert));
    } else {
      this.subscribeToSaveResponse(this.espaceVertService.create(espaceVert));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEspaceVert>>): void {
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

  protected updateForm(espaceVert: IEspaceVert): void {
    this.editForm.patchValue({
      id: espaceVert.id,
      libelle: espaceVert.libelle,
      photo: espaceVert.photo,
      user: espaceVert.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, espaceVert.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IEspaceVert {
    return {
      ...new EspaceVert(),
      id: this.editForm.get(['id'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
