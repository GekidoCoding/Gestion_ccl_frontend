import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Infrastructure } from '../../../model/infrastructure/infrastructure';
import { Localisation } from '../../../model/localisation/localisation';
import { Etat } from '../../../model/etat/etat';
import { CategorieInfra } from '../../../model/categorie-infra/categorie-infra';
import { ModeleInfra } from '../../../model/modele-infra/modele-infra';
import { InfrastructureService } from '../../../services/infrastructure/infrastructure.service';
import { LocalisationService } from '../../../services/localisation/localisation.service';
import { EtatService } from '../../../services/etat/etat.service';
import { CategorieInfraService } from '../../../services/categorie-infra/categorie-infra.service';
import { ModeleInfraService } from '../../../services/modele-infra/modele-infra.service';
import { DetailInfrastructureComponent } from '../detail-infrastructure/detail-infrastructure.component';
import { Page } from '../../../interface/page.interface';
import { InfrastructureAddFormComponent } from '../infrastructure-add-form/infrastructure-add-form.component';
import { YesNoWarningComponent } from '../../yes-no-warning/yes-no-warning.component';
import { InfrastructureUtil } from '../../../util/infrastructure.util';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-infrastructure-list-popup',
  templateUrl: './infrastructure-list-popup.component.html',
  styleUrls: ['./infrastructure-list-popup.component.scss']
})
export class InfrastructureListPopupComponent implements OnInit {
  @Output() infrastructureSelectedChange = new EventEmitter<Infrastructure[]>();
  @Input() infrastructureNotInSelections: Infrastructure[] = [];
  items: Infrastructure[] = [];
  filteredItems: Infrastructure[] = [];
  allItems: Infrastructure[] = [];
  localisations: Localisation[] = [];
  etats: Etat[] = [];
  categories: CategorieInfra[] = [];
  filteredModeles: ModeleInfra[] = [];
  modeles: ModeleInfra[] = [];
  newItem: Infrastructure = new Infrastructure();
  isLoading = true;
  showConfirmation = false;
  confirmationMessage = '';
  errorMessage = '';
  showSearchForm = false;
  searchCriteria: Infrastructure = new Infrastructure();
  localisationSelectionned: { [key: string]: boolean } = {};
  modelesInfraSelectionned: { [key: string]: boolean } = {};
  localisationIds: string[] = [];
  modelesIds: string[] = [];
  debutSearch: string = '';
  finSearch: string = '';
  selectedInfrastructures: Infrastructure[] = [];

  // Pagination properties
  currentPage: number = 0;
  totalPages: number = 0;
  totalItems: number = 0;
  pageNumbers: number[] = [];
  readonly itemsPerPage: number = 10;

  // Autocomplete properties
  designationCtrl = new FormControl('');
  filteredDesignations: Observable<Infrastructure[]>;

  constructor(
      private modalService: NgbModal,
      private infrastructureService: InfrastructureService,
      private localisationService: LocalisationService,
      private etatService: EtatService,
      private catInfraService: CategorieInfraService,
      private modeleInfraService: ModeleInfraService,
      private toastr: ToastrService,
      public modal: NgbModal,
      public activeModal:NgbActiveModal
  ) {
    this.filteredDesignations = this.designationCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterDesignations(value || ''))
    );
  }

  ngOnInit() {
    this.loadAllItems();
    this.loadInfrastructures();
    this.loadLocalisations();
    this.loadEtats();
    this.loadCategories();
    this.loadModeles();
  }

  private _filterDesignations(value: string | Infrastructure): Infrastructure[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.nom.toLowerCase();
    return this.allItems.filter(item =>
        item.nom.toLowerCase().includes(filterValue)
    );
  }

  displayValueFn(value: string): string {
    return value;
  }

  onDesignationSelected(event: MatAutocompleteSelectedEvent) {
    const selectedInfrastructure: Infrastructure = event.option.value;
    this.designationCtrl.setValue(selectedInfrastructure.nom);
    this.searchCriteria.nom = selectedInfrastructure.nom;
  }

  loadAllItems() {
    this.infrastructureService.getAll().subscribe({
      next: (data) => {
        this.allItems = data;
      },
      error: (error) => {
        console.error('Error loading all infrastructures:', error);
        this.toastr.error('Erreur lors du chargement des infrastructures');
      }
    });
  }

  getVisiblePageNumbers(totalPages: number, currentPage: number): number[] {
    if (totalPages <= 0) return [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  loadInfrastructures() {
    this.isLoading = true;
    this.infrastructureService.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (page: Page<Infrastructure>) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = this.getVisiblePageNumbers(this.totalPages, this.currentPage + 1);
        this.filteredItems = this.items
            .filter(item =>
                !this.infrastructureNotInSelections.some(notSelected => notSelected.id === item.id) &&
                !this.selectedInfrastructures.some(selected => selected.id === item.id)
            )
            .sort((a, b) => a.nom.localeCompare(b.nom));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading infrastructures:', error);
        this.toastr.error('Erreur lors du chargement des infrastructures');
        this.isLoading = false;
      }
    });
  }

  loadLocalisations() {
    this.localisationService.getAll().subscribe({
      next: (localisations) => this.localisations = localisations,
      error: (error) => {
        console.error('Error loading localisations:', error);
        this.toastr.error('Erreur lors du chargement des localisations');
      }
    });
  }

  loadEtats() {
    this.etatService.getAll().subscribe({
      next: (etats) => this.etats = etats,
      error: (error) => {
        console.error('Error loading etats:', error);
        this.toastr.error('Erreur lors du chargement des états');
      }
    });
  }

  loadCategories() {
    this.catInfraService.getAll().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('Erreur lors du chargement des catégories');
      }
    });
  }

  loadModeles() {
    this.modeleInfraService.getAll().subscribe({
      next: (modeles) => {
        this.modeles = modeles;
        this.filteredModeles = [...modeles];
      },
      error: (error) => {
        console.error('Error loading modeles:', error);
        this.toastr.error('Erreur lors du chargement des modèles');
      }
    });
  }

  selectInfrastructure(id: string) {
    const infra = this.items.find(item => item.id === id);
    if (infra && !this.selectedInfrastructures.some(selected => selected.id === infra.id)) {
      this.selectedInfrastructures.push(infra);
      this.selectedInfrastructures.sort((a, b) => a.nom.localeCompare(b.nom));
      this.loadInfrastructures(); // Refresh filtered items to exclude newly selected infrastructure
    }
  }

  removeSelectedInfrastructure(id: string) {
    this.selectedInfrastructures = this.selectedInfrastructures.filter(item => item.id !== id);
    this.loadInfrastructures(); // Refresh filtered items to include removed infrastructure
  }

  validateSelection() {
    if (this.selectedInfrastructures.length > 0) {
      this.infrastructureSelectedChange.emit([...this.selectedInfrastructures]);
      this.activeModal.dismiss();
    } else {
      this.toastr.warning('Veuillez sélectionner au moins une infrastructure.');
    }
  }

  resetSearchForm() {
    this.searchCriteria = new Infrastructure();
    this.designationCtrl.setValue('');
    this.debutSearch = '';
    this.finSearch = '';
    this.modelesIds = [];
    this.localisationIds = [];
    this.localisationSelectionned = {};
    this.modelesInfraSelectionned = {};
    this.currentPage = 0;
    this.loadInfrastructures();
  }

  toggleSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    if (!this.showSearchForm) {
      this.resetSearchCriteria();
    }
  }

  applySearch() {
    this.currentPage = 0;
    this.isLoading = true;
    const nom = typeof this.designationCtrl.value === 'string' ? this.designationCtrl.value : this.designationCtrl.value?.nom || '';
    const numero = this.searchCriteria.numero?.trim() || undefined;
    const categorieInfraId = this.searchCriteria.modeleInfra?.catInfra?.id || undefined;

    this.localisationIds = Object.keys(this.localisationSelectionned).filter(id => this.localisationSelectionned[id]);
    this.modelesIds = Object.keys(this.modelesInfraSelectionned).filter(id => this.modelesInfraSelectionned[id]);
    const debutStr = this.debutSearch;
    const finStr = this.finSearch;

    this.infrastructureService.searchInfrastructures(
        this.currentPage,
        this.itemsPerPage,
        nom,
        numero,
        this.localisationIds,
        this.modelesIds,
        categorieInfraId,
        debutStr,
        finStr
    ).subscribe({
      next: (page: Page<Infrastructure>) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = this.getVisiblePageNumbers(this.totalPages, this.currentPage + 1);
        this.filteredItems = this.items
            .filter(item =>
                !this.infrastructureNotInSelections.some(notSelected => notSelected.id === item.id) &&
                !this.selectedInfrastructures.some(selected => selected.id === item.id)
            )
            .sort((a, b) => a.nom.localeCompare(b.nom));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'application des filtres:', error);
        this.toastr.error('Erreur lors de l\'application des filtres');
        this.isLoading = false;
      }
    });
  }

  updateLocalisationSelection(localisationId: string) {
    this.localisationIds = Object.keys(this.localisationSelectionned).filter(id => this.localisationSelectionned[id]);
  }

  updateModeleSelection(modeleId: string) {
    this.modelesIds = Object.keys(this.modelesInfraSelectionned).filter(id => this.modelesInfraSelectionned[id]);
  }

  resetSearchCriteria() {
    this.searchCriteria = new Infrastructure();
    this.designationCtrl.setValue('');
    this.localisationSelectionned = {};
    this.modelesInfraSelectionned = {};
    this.localisationIds = [];
    this.modelesIds = [];
    this.debutSearch = '2025-01-01T00:00';
    this.finSearch = '2025-01-02T00:00';
    this.currentPage = 0;
    this.loadInfrastructures();
  }

  showSuccessMessage(message: string) {
    this.toastr.success(message);
  }

  showErrorMessage(message: string) {
    this.toastr.error(message);
  }

  navigateToDetailInfra(id: string) {
    const modal = this.modalService.open(DetailInfrastructureComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modal.componentInstance.infrastructureId = id;
    modal.componentInstance.loadData.subscribe(() => {
      this.loadInfrastructures();
    });
  }

  onCategoryChange(categoryId: string) {
    if (categoryId) {
      this.filteredModeles = this.modeles.filter(m => m.catInfra.id === categoryId);
    } else {
      this.filteredModeles = [...this.modeles];
    }
    this.modelesInfraSelectionned = {};
    this.modelesIds = [];
    this.newItem.modeleInfra = new ModeleInfra();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage + 1) return;
    this.currentPage = page - 1;
    this.loadInfrastructures();
  }

  create(infrastructure: Infrastructure) {
    this.infrastructureService.create(infrastructure).subscribe({
      next: () => {
        this.currentPage = 0;
        this.showSuccessMessage('Infrastructure ajoutée avec succès !');
        this.loadInfrastructures();
      },
      error: (error) => {
        console.error('Error adding infrastructure:', error);
        this.showErrorMessage('Erreur lors de l\'ajout de l\'infrastructure');
      }
    });
  }

  addItem(infrastructure: Infrastructure) {
    this.infrastructureService.checkInfrastructureSimilarity(infrastructure).subscribe({
      next: (data: Infrastructure[]) => {
        if (data.length > 0) {
          let message: string = InfrastructureUtil.getWarningMessageSimilarityFromList(data);
          let composant = this.modalService.open(YesNoWarningComponent);
          composant.componentInstance.message = message;
          composant.componentInstance.confirm.subscribe({
            next: () => {
              this.create(infrastructure);
            }
          });
          composant.componentInstance.decline.subscribe({
            next: () => {
              composant.close();
            }
          });
        } else {
          this.create(infrastructure);
        }
      },
      error: () => {
        this.showErrorMessage('Erreur lors de verification de similarite');
      }
    });
  }


  openAddModalPopup() {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const modalComponent = this.modalService.open(InfrastructureAddFormComponent, options);
    modalComponent.componentInstance.newItem = this.newItem;
    modalComponent.componentInstance.localisations = this.localisations;
    modalComponent.componentInstance.etats = this.etats;
    modalComponent.componentInstance.categories = this.categories;
    modalComponent.componentInstance.filteredModeles = this.filteredModeles;
    modalComponent.componentInstance.submitForm.subscribe((event: any) => {
      this.addItem(event);
      modalComponent.close();
      this.loadInfrastructures();
    });
    modalComponent.componentInstance.cancel.subscribe(() => {
      modalComponent.dismiss('Cancel click');
    });
  }
}