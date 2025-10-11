import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BaseCrudComponent, Page } from '../../base/base-crud.component';
import { TypeClient } from '../../model/type-client/type-client';
import { TypeClientService } from '../../services/type-client/type-client.service';
import { ToastrService } from 'ngx-toastr';
import {TypeClientAddComponent} from "../../components/type-client/type-client-add/type-client-add.component";
import {TypeClientUpdateComponent} from "../../components/type-client/type-client-update/type-client-update.component";

@Component({
  selector: 'app-type-client',
  templateUrl: './type-client.component.html',
  styleUrls: ['./type-client.component.scss']
})
export class TypeClientComponent extends BaseCrudComponent<TypeClient> {
  constructor(
      modalService: NgbModal,
      private service: TypeClientService,
      protected toastr: ToastrService
  ) {
    super(modalService, toastr);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.service.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (page: Page<TypeClient>) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (error) => {
        console.error('Error loading type clients:', error);
        this.showErrorMessage('Erreur lors du chargement des types de clients');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  protected applyFilters(items: TypeClient[]): TypeClient[] {
    let result = [...items];
    if (this.searchCriteria.id) {
      result = result.filter(item =>
          item.id.toLowerCase().includes(this.searchCriteria.id!.toLowerCase())
      );
    }
    if (this.searchCriteria.typeClient) {
      result = result.filter(item =>
          item.typeClient.toLowerCase().includes(this.searchCriteria.typeClient!.toLowerCase())
      );
    }
    return result;
  }

  protected isDateColumn(column: keyof TypeClient): boolean {
    return false;
  }

  initializeNewItem(): Partial<TypeClient> {
    return { typeClient: '' };
  }

  resetSearchCriteria(): Partial<TypeClient> {
    return { id: undefined, typeClient: '' };
  }

  openAddModal() {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(TypeClientAddComponent, options);
    component.componentInstance.afterAdd.subscribe({
      next: () => {
        this.currentPage = 0;
        this.loadData();
        this.showSuccessMessage('Type de client ajouté avec succès !');
      },
      error: () => {
        console.error('Error adding type client');
        this.showErrorMessage('Erreur lors de l\'ajout du type de client');
      }
    });
  }

  openUpdateModal(item: TypeClient) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(TypeClientUpdateComponent, options);
    component.componentInstance.typeClient = { ...item };
    component.componentInstance.afterUpdate.subscribe({
      next: () => {
        this.loadData();
        this.showSuccessMessage('Type de client modifié avec succès !');
      },
      error: () => {
        console.error('Error updating type client');
        this.showErrorMessage('Erreur lors de la modification du type de client');
      }
    });
  }

  deleteSelectedItems(modal: any) {
    this.isLoading = true;
    const deleteObservables = Object.keys(this.selectedIds).map(id =>
        this.service.delete(id)
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
      console.error('Error deleting type clients:', error);
      this.showErrorMessage('Impossible de supprimer le(s) type(s) de client(s) qui ont des entités qui en dépendent');
    }).finally(() => {
      this.isLoading = false;
    });
  }
}