import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModeleInfra } from '../../model/modele-infra/modele-infra';
import { BaseCrudComponent, Page } from '../../base/base-crud.component';
import { ModeleInfraService } from '../../services/modele-infra/modele-infra.service';
import { ToastrService } from 'ngx-toastr';
import {
  ModeleInfraAddFormComponent
} from "../../components/modele-infra/modele-infra-add-form/modele-infra-add-form.component";
import {
  ModeleInfraUpdateFormComponent
} from "../../components/modele-infra/modele-infra-update-form/modele-infra-update-form.component";

@Component({
  selector: 'app-modele-infra-crud',
  templateUrl: './modele-infra.component.html',
  styleUrls: ['../../base/base-crud.component.scss']
})
export class ModeleInfraComponent extends BaseCrudComponent<ModeleInfra> {
  constructor(
      modalService: NgbModal,
      private modeleInfraService: ModeleInfraService,
      protected toastr: ToastrService
  ) {
    super(modalService, toastr);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.modeleInfraService.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (page: Page<ModeleInfra>) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (error) => {
        console.error('Error loading modele infras:', error);
        this.showErrorMessage('Erreur lors du chargement des modèles d\'infrastructure');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  protected applyFilters(items: ModeleInfra[]): ModeleInfra[] {
    let result = [...items];
    if (this.searchCriteria.nom) {
      result = result.filter(item => item.nom.toLowerCase().includes(this.searchCriteria.nom!.toLowerCase()));
    }
    if (this.searchCriteria.catInfra && this.searchCriteria.catInfra.id) {
      result = result.filter(item => item.catInfra.id === this.searchCriteria.catInfra!.id);
    }
    return result;
  }

  protected isDateColumn(column: keyof ModeleInfra): boolean {
    return false;
  }

  initializeNewItem(): Partial<ModeleInfra> {
    return new ModeleInfra();
  }

  resetSearchCriteria(): Partial<ModeleInfra> {
    return new ModeleInfra();
  }

  openAddModal() {
    this.newItem = this.initializeNewItem();
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const modalRef = this.modalService.open(ModeleInfraAddFormComponent, options);
    modalRef.componentInstance.loadData.subscribe(() => {
      this.loadData();
    });
  }

  openUpdateModal(idModeleInfra:string) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const modalRef = this.modalService.open(ModeleInfraUpdateFormComponent, options);
    modalRef.componentInstance.idModeleInfra=idModeleInfra;
    modalRef.componentInstance.loadData.subscribe(() => {
      this.loadData();
    });
  }

  deleteSelectedItems(modal: any) {
    this.isLoading = true;
    const deleteObservables = Object.keys(this.selectedIds).map(id =>
        this.modeleInfraService.delete(id)
    );

    Promise.all(deleteObservables.map(obs => obs.toPromise())).then(() => {
      this.currentPage = 0;
      this.loadData();
      this.selectedIds = {};
      this.selectAll = false;
      this.isSelectionMode = false;
      modal.close();
      this.showSuccessMessage('Suppression réussie !');
    }).catch(error => {
      console.error('Error deleting modele infras:', error);
      this.showErrorMessage('Impossible de supprimer le(s) modèle(s) d\'infrastructure qui ont des entités qui en dépendent');
    }).finally(() => {
      this.isLoading = false;
    });
  }
}