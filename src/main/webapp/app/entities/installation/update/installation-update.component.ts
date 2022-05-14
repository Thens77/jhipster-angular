import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IInstallation, Installation } from '../installation.model';
import { InstallationService } from '../service/installation.service';
import { Router } from '@angular/router';
@Component({
  selector: 'jhi-installation-update',
  templateUrl: './installation-update.component.html',
})
export class InstallationUpdateComponent implements OnInit {
  isSaving = false;
  
  editForm1 = this.fb.group({
     id: [],
    dateDebut: [],
    dateFin: [],
  });

  constructor(protected router: Router , protected installationService: InstallationService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ installation }) => {
      this.updateForme(installation);
    });
  }
  reloadComponent() : void {
    const currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }

  previousState(): void {
    window.history.back();
  }

  savei(): void {
    this.isSaving = true;
    const installation = this.createFromForme();
    if (installation.id !== undefined  && typeof(installation.id)==='number' && this.editForm1.get(['id'])?.value!==null) {
      this.subscribeToSaveResponse(this.installationService.update(installation));
    } else {
      this.subscribeToSaveResponse(this.installationService.create(installation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstallation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.reloadComponent();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForme(installation: IInstallation): void {
    this.editForm1.patchValue({
      id: installation.id,
      dateDebut: installation.dateDebut,
      dateFin: installation.dateFin,
    });
  }

  protected createFromForme(): IInstallation {
    return {
      ...new Installation(),
      id: this.editForm1.get(['id'])!.value,
      dateDebut: this.editForm1.get(['dateDebut'])!.value,
      dateFin: this.editForm1.get(['dateFin'])!.value,
    };
  }
}
