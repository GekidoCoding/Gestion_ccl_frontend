import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BaseCrudComponent, Page } from '../../components/base/base-crud.component';
import { Etat } from '../../model/etat/etat';
import { EtatService } from '../../services/etat/etat.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-etat',
  templateUrl: './etat.component.html',
  styleUrls: ['../../components/base/base-crud.component.scss']
})
export class EtatComponent extends BaseCrudComponent<Etat> {
  constructor(modalService: NgbModal, private etatService: EtatService, protected toastr: ToastrService) {
    super(modalService, toastr);
  }

  ngOnInit() {
    this.loadData();
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  loadData() {
    this.isLoading = true;
    this.etatService.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (page: Page<Etat>) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading etats:', error);
        this.showErrorMessage('Erreur lors du chargement des états');
        this.isLoading = false;
      }
    });
  }

  protected applyFilters(items: Etat[]): Etat[] {
    let result = [...items];
    if (this.searchCriteria.id) {
      result = result.filter(item =>
          item.id.toLowerCase().includes(this.searchCriteria.id!.toLowerCase())
      );
    }
    if (this.searchCriteria.etat) {
      result = result.filter(item =>
          item.etat.toLowerCase().includes(this.searchCriteria.etat!.toLowerCase())
      );
    }
    if (this.searchCriteria.code) {
      result = result.filter(item =>
          item.code.toString().includes(this.searchCriteria.code!.toString())
      );
    }
    return result;
  }

  protected isDateColumn(column: keyof Etat): boolean {
    return false;
  }

  initializeNewItem(): Partial<Etat> {
    return { id: '', etat: '', code: undefined };
  }

  resetSearchCriteria(): Partial<Etat> {
    return { id: '', etat: '', code: undefined };
  }

  addItem() {
    const etat: Etat = new Etat();
    etat.etat = this.newItem.etat!;
    etat.code = this.newItem.code!;

    this.etatService.create(etat).subscribe({
      next: (createdEtat) => {
        this.currentPage = 0; // Reset to first page
        this.loadData();
        this.showSuccessMessage('État ajouté avec succès !');
      },
      error: (error) => {
        console.error('Error adding etat:', error);
        this.showErrorMessage('Erreur lors de l\'ajout de l\'état');
      }
    });
  }

  confirmUpdate(modal: any) {
    const etat: Etat = new Etat();
    etat.id = this.selectedItem!.id;
    etat.etat = this.selectedItem!.etat;
    etat.code = this.selectedItem!.code;

    this.etatService.update(this.selectedItem!.id, etat).subscribe({
      next: (updatedEtat) => {
        this.currentPage = 0; // Reset to first page
        this.loadData();
        modal.close();
        this.showSuccessMessage('Modification réussie !');
      },
      error: (error) => {
        console.error('Error updating etat:', error);
        this.showErrorMessage('Erreur lors de la modification de l\'état');
      }
    });
  }

  openUpdateModal(content: any, item: Etat) {
    this.selectedItem = { ...item };
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  deleteSelectedItems(modal: any) {
    const deleteObservables = Object.keys(this.selectedIds).map(id =>
        this.etatService.delete(id)
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
      console.error('Error deleting etats:', error);
      this.showErrorMessage('Erreur lors de la suppression des états');
    });
  }
}