import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import {BaseCrudComponent} from "../../../components/base/base-crud.component";
import {Frequence} from "../../../model/frequence/frequence";
import {FrequenceService} from "../../../services/frequence/frequence.service";
import {Page} from "../../../interface/page.interface";

@Component({
  selector: 'app-frequence',
  templateUrl: './frequence.component.html',
  styleUrls: ['./frequence.component.scss']
})
export class FrequenceComponent extends BaseCrudComponent<Frequence> {
  selectedItem : Frequence = new Frequence();
  constructor(modalService: NgbModal, private frequenceService: FrequenceService, protected toastr: ToastrService) {
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
    this.frequenceService.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (page: Page<Frequence>) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading frequences:', error);
        this.showErrorMessage('Erreur lors du chargement des fréquences');
        this.isLoading = false;
      }
    });
  }

  protected applyFilters(items: Frequence[]): Frequence[] {
    let result = [...items];
    if (this.searchCriteria.id) {
      result = result.filter(item =>
          item.id.toLowerCase().includes(this.searchCriteria.id!.toLowerCase())
      );
    }
    if (this.searchCriteria.libelle) {
      result = result.filter(item =>
          item.libelle.toLowerCase().includes(this.searchCriteria.libelle!.toLowerCase())
      );
    }
    return result;
  }

  protected isDateColumn(column: keyof Frequence): boolean {
    return false;
  }

  initializeNewItem(): Partial<Frequence> {
    return { id: '', libelle: '' };
  }

  resetSearchCriteria(): Partial<Frequence> {
    return { id: '', libelle: '' };
  }

  addItem() {
    const frequence: Frequence = new Frequence();
    frequence.libelle = this.newItem.libelle!;

    this.frequenceService.create(frequence).subscribe({
      next: (createdFrequence) => {
        this.currentPage = 0; // Reset to first page
        this.loadData();
        this.showSuccessMessage('Fréquence ajoutée avec succès !');
      },
      error: (error) => {
        console.error('Error adding frequence:', error);
        this.showErrorMessage('Erreur lors de l\'ajout de la fréquence');
      }
    });
  }

  confirmUpdate(modal: any) {
    const frequence: Frequence = new Frequence();
    frequence.id = this.selectedItem!.id;
    frequence.libelle = this.selectedItem!.libelle;

    this.frequenceService.update(this.selectedItem!.id, frequence).subscribe({
      next: (updatedFrequence) => {
        this.currentPage = 0; // Reset to first page
        this.loadData();
        modal.close();
        this.showSuccessMessage('Modification réussie !');
      },
      error: (error) => {
        console.error('Error updating frequence:', error);
        this.showErrorMessage('Erreur lors de la modification de la fréquence');
      }
    });
  }

  openUpdateModal(content: any, item: Frequence) {
    this.selectedItem = { ...item };
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  deleteSelectedItems(modal: any) {
    const deleteObservables = Object.keys(this.selectedIds).map(id =>
        this.frequenceService.delete(id)
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
      console.error('Error deleting frequences:', error);
      this.showErrorMessage('Erreur lors de la suppression des fréquences');
    });
  }
}