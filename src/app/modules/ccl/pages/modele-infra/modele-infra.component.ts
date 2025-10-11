import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModeleInfra } from '../../model/modele-infra/modele-infra';
import { BaseCrudComponent, Page } from '../../base/base-crud.component';
import { CategorieInfra } from '../../model/categorie-infra/categorie-infra';
import { ModeleInfraService } from '../../services/modele-infra/modele-infra.service';
import { CategorieInfraService } from '../../services/categorie-infra/categorie-infra.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-modele-infra-crud',
  templateUrl: './modele-infra.component.html',
  styleUrls: ['../../base/base-crud.component.scss']
})
export class ModeleInfraComponent extends BaseCrudComponent<ModeleInfra> {
  catInfras: CategorieInfra[] = [];

  constructor(
      modalService: NgbModal,
      private modeleInfraService: ModeleInfraService,
      private categorieInfraService: CategorieInfraService,
      protected toastr: ToastrService
  ) {
    super(modalService, toastr);
  }

  ngOnInit() {
    this.isLoading = true;
    forkJoin({
      categories: this.categorieInfraService.getAll(),
      data: this.modeleInfraService.getPaginated(this.currentPage, this.itemsPerPage)
    }).subscribe({
      next: ({ categories, data }) => {
        this.catInfras = categories;
        this.items = data.content;
        this.totalPages = data.totalPages;
        this.totalItems = data.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (error) => {
        console.error('Error during initialization:', error);
        this.showErrorMessage('Erreur lors du chargement initial des données');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
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

  loadCategorieInfras() {
    this.isLoading = true;
    this.categorieInfraService.getAll().subscribe({
      next: (catInfras) => {
        this.catInfras = catInfras;
      },
      error: (error) => {
        console.error('Error loading categorie infras:', error);
        this.showErrorMessage('Erreur lors du chargement des catégories d\'infrastructure');
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
    return { nom: '', catInfra: { id: '', nom: '' } };
  }

  resetSearchCriteria(): Partial<ModeleInfra> {
    return { nom: '', catInfra: { id: '', nom: '' } };
  }

  addItem() {
    this.isLoading = true;
    const modeleInfra: ModeleInfra = new ModeleInfra();
    modeleInfra.nom = this.newItem.nom!;
    modeleInfra.catInfra = this.catInfras.find(cat => cat.id === this.newItem.catInfra!.id)!;

    this.modeleInfraService.create(modeleInfra).subscribe({
      next: () => {
        this.currentPage = 0;
        this.loadData();
        this.showSuccessMessage('Modèle d\'infrastructure ajouté avec succès !');
      },
      error: (error) => {
        console.error('Error adding modele infra:', error);
        this.showErrorMessage('Erreur lors de l\'ajout du modèle d\'infrastructure');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  confirmUpdate(modal: any) {
    this.isLoading = true;
    const modeleInfra: ModeleInfra = new ModeleInfra();
    modeleInfra.id = this.selectedItem!.id;
    modeleInfra.nom = this.selectedItem!.nom;
    modeleInfra.catInfra = this.catInfras.find(cat => cat.id === this.selectedItem!.catInfra!.id)!;

    this.modeleInfraService.update(this.selectedItem!.id, modeleInfra).subscribe({
      next: () => {
        this.loadData();
        modal.close();
        this.showSuccessMessage('Modification réussie !');
      },
      error: (error) => {
        console.error('Error updating modele infra:', error);
        this.showErrorMessage('Erreur lors de la modification du modèle d\'infrastructure');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  openUpdateModal(content: any, item: ModeleInfra) {
    this.selectedItem = { ...item, catInfra: { ...item.catInfra } };
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
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