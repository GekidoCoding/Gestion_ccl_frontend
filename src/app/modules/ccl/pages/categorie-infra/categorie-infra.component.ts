import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BaseCrudComponent, Page } from '../../base/base-crud.component';
import { CategorieInfra } from '../../model/categorie-infra/categorie-infra';
import { CategorieInfraService } from '../../services/categorie-infra/categorie-infra.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categorie-infra',
  templateUrl: './categorie-infra.component.html',
  styleUrls: ['../../base/base-crud.component.scss']
})
export class CategorieInfraComponent extends BaseCrudComponent<CategorieInfra> {
  constructor(modalService: NgbModal, private categorieInfraService: CategorieInfraService, protected toastr: ToastrService) {
    super(modalService, toastr);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.categorieInfraService.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (page: Page<CategorieInfra>) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.showErrorMessage('Erreur lors du chargement des catégories');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  protected applyFilters(items: CategorieInfra[]): CategorieInfra[] {
    let result = [...items];
    if (this.searchCriteria.id) {
      result = result.filter(item =>
          item.id.toLowerCase().includes(this.searchCriteria.id!.toLowerCase())
      );
    }
    if (this.searchCriteria.nom) {
      result = result.filter(item =>
          item.nom.toLowerCase().includes(this.searchCriteria.nom!.toLowerCase())
      );
    }
    return result;
  }

  protected isDateColumn(column: keyof CategorieInfra): boolean {
    return false;
  }

  initializeNewItem(): Partial<CategorieInfra> {
    return { id: '', nom: '' };
  }

  resetSearchCriteria(): Partial<CategorieInfra> {
    return { id: '', nom: '' };
  }

  addItem() {
    this.isLoading = true;
    const categorieInfra: CategorieInfra = new CategorieInfra();
    categorieInfra.nom = this.newItem.nom!;

    this.categorieInfraService.create(categorieInfra).subscribe({
      next: () => {
        this.currentPage = 0;
        this.loadData();
        this.showSuccessMessage('Catégorie ajoutée avec succès !');
      },
      error: (error) => {
        console.error('Error adding categorie:', error);
        this.showErrorMessage('Erreur lors de l\'ajout de la catégorie');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  confirmUpdate(modal: any) {
    this.isLoading = true;
    const categorieInfra: CategorieInfra = new CategorieInfra();
    categorieInfra.id = this.selectedItem!.id;
    categorieInfra.nom = this.selectedItem!.nom;

    this.categorieInfraService.update(this.selectedItem!.id, categorieInfra).subscribe({
      next: () => {
        this.loadData();
        modal.close();
        this.showSuccessMessage('Modification réussie !');
      },
      error: (error) => {
        console.error('Error updating categorie:', error);
        this.showErrorMessage('Erreur lors de la modification de la catégorie');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  openUpdateModal(content: any, item: CategorieInfra) {
    this.selectedItem = { ...item };
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  deleteSelectedItems(modal: any) {
    this.isLoading = true;
    const deleteObservables = Object.keys(this.selectedIds).map(id =>
        this.categorieInfraService.delete(id)
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
      console.error('Error deleting categories:', error);
      this.showErrorMessage('Impossible de supprimer le(s) catégorie(s) qui ont des entités qui en dépendent');
    }).finally(() => {
      this.isLoading = false;
    });
  }
}