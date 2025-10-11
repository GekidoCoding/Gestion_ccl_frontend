import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BaseCrudComponent, Page } from '../../base/base-crud.component';
import { Localisation } from '../../model/localisation/localisation';
import { LocalisationService } from '../../services/localisation/localisation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-localisation',
  templateUrl: './localisation.component.html',
  styleUrls: ['./localisation.component.scss']
})
export class LocalisationComponent extends BaseCrudComponent<Localisation> {
  constructor(modalService: NgbModal, private service: LocalisationService, protected toastr: ToastrService) {
    super(modalService, toastr);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.service.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (page: Page<Localisation>) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (error) => {
        console.error('Error loading localisations:', error);
        this.showErrorMessage('Erreur lors du chargement des localisations');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  protected applyFilters(items: Localisation[]): Localisation[] {
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

  protected isDateColumn(column: keyof Localisation): boolean {
    return false;
  }

  initializeNewItem(): Partial<Localisation> {
    return { nom: '' };
  }

  resetSearchCriteria(): Partial<Localisation> {
    return { id: undefined, nom: '' };
  }

  addItem() {
    this.isLoading = true;
    const localisation: Localisation = new Localisation();
    localisation.nom = this.newItem.nom!;

    this.service.create(localisation).subscribe({
      next: () => {
        this.currentPage = 0;
        this.loadData();
        this.showSuccessMessage('Localisation ajoutée avec succès !');
      },
      error: (error) => {
        console.error('Error adding localisation:', error);
        this.showErrorMessage('Erreur lors de l\'ajout de la localisation');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  confirmUpdate(modal: any) {
    this.isLoading = true;
    const localisation: Localisation = new Localisation();
    localisation.id = this.selectedItem!.id;
    localisation.nom = this.selectedItem!.nom;

    this.service.update(this.selectedItem!.id, localisation).subscribe({
      next: () => {
        this.loadData();
        modal.close();
        this.showSuccessMessage('Modification réussie !');
      },
      error: (error) => {
        console.error('Error updating localisation:', error);
        this.showErrorMessage('Erreur lors de la modification de la localisation');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  openUpdateModal(content: any, item: Localisation) {
    this.selectedItem = { ...item };
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  deleteSelectedItems(modal: any) {
    this.isLoading = true;
    const deleteObservables = Object.keys(this.selectedIds).map(id =>
        this.service.delete(id)
    );

    Promise.all(deleteObservables.map(obs => obs.toPromise())).then(() => {
      this.currentPage = 0; // Reset to first page
      this.loadData();
      this.selectedIds = {};
      this.selectAll = false;
      this.isSelectionMode = false;
      modal.close();
      this.showSuccessMessage('Suppression réussie !');
    }).catch(error => {
      console.error('Error deleting localisations:', error);
      this.showErrorMessage('Impossible de supprimer le(s) localisation(s) qui ont des entités qui en dépendent');
    }).finally(() => {
      this.isLoading = false;
    });
  }
}