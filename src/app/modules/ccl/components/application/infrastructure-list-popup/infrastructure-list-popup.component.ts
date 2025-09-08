import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Infrastructure } from "../../../model/infrastructure/infrastructure";
import { Localisation } from "../../../model/localisation/localisation";
import { Etat } from "../../../model/etat/etat";
import { CategorieInfra } from "../../../model/categorie-infra/categorie-infra";
import { ModeleInfra } from "../../../model/modele-infra/modele-infra";
import { InfrastructureService } from "../../../services/infrastructure/infrastructure.service";
import { LocalisationService } from "../../../services/localisation/localisation.service";
import { EtatService } from "../../../services/etat/etat.service";
import { CategorieInfraService } from "../../../services/categorie-infra/categorie-infra.service";
import { ModeleInfraService } from "../../../services/modele-infra/modele-infra.service";
import { DetailInfrastructureComponent } from "../detail-infrastructure/detail-infrastructure.component";

@Component({
  selector: 'app-infrastructure-list-popup',
  templateUrl: './infrastructure-list-popup.component.html',
  styleUrls: ['./infrastructure-list-popup.component.scss']
})
export class InfrastructureListPopupComponent implements OnInit {
  @Output() infrastructureSelected = new EventEmitter<Infrastructure>();
  @Input() infrastructureNotInSelections: Infrastructure[]=[];

  items: Infrastructure[] = [];
  filteredItems: Infrastructure[] = [];
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

  constructor(
      private modalService: NgbModal,
      private infrastructureService: InfrastructureService,
      private localisationService: LocalisationService,
      private etatService: EtatService,
      private catInfraService: CategorieInfraService,
      private modeleInfraService: ModeleInfraService,
      private toastr: ToastrService ,
      // public activeModal: NgbActiveModal ,
      public modal:NgbModal,
  ) {}

  ngOnInit() {
    this.loadInfrastructures();
    this.loadLocalisations();
    this.loadEtats();
    this.loadCategories();
    this.loadModeles();
  }

  loadInfrastructures() {
    this.isLoading = true;
    this.infrastructureService.getAll().subscribe({
      next: (infrastructures) => {
        this.items = infrastructures;
        this.filteredItems = this.items.filter(
            item => !this.infrastructureNotInSelections.some(notSelected => notSelected.id === item.id)
        );
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

  initializeNewItem(): Partial<Infrastructure> {
    return new Infrastructure();
  }

  openAddModal(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
  }

  handleAddFormSubmit(infrastructure: Infrastructure) {
    this.isLoading = true;
    this.infrastructureService.create(infrastructure).subscribe({
      next: () => {
        this.loadInfrastructures();
        // this.toastr.success('Infrastructure ajoutée avec succès !');
        this.newItem =new Infrastructure();
      },
      error: (error) => {
        console.error('Error adding infrastructure:', error);
        this.toastr.error('Erreur lors de l\'ajout de l\'infrastructure');
      }
    });
  }

  selectionnedInfrastructure(id: string) {
    const selectedInfra = this.items.find(item => item.id === id);
    if (selectedInfra) {
      this.infrastructureSelected.emit(selectedInfra);
      // this.toastr.success('Infrastructure sélectionnée avec succès !');
    }
  }

  resetSearchForm(){
    this.searchCriteria=new Infrastructure();
    this.debutSearch='';
    this.finSearch='';
    this.modelesIds=[];
    this.localisationIds=[];
    this.ngOnInit();
  }

  toggleSearchForm() {
    this.showSearchForm = !this.showSearchForm;
    if (!this.showSearchForm) {
      this.resetSearchCriteria();
    }
  }

  applySearch() {
    this.isLoading = true;
    const nom = this.searchCriteria.nom?.trim() || undefined;
    const numero = this.searchCriteria.numero?.trim() || undefined;
    const categorieInfraId = this.searchCriteria.modeleInfra?.catInfra?.id || undefined;

    this.localisationIds = Object.keys(this.localisationSelectionned).filter(id => this.localisationSelectionned[id]);
    this.modelesIds = Object.keys(this.modelesInfraSelectionned).filter(id => this.modelesInfraSelectionned[id]);
    const debutStr = this.debutSearch;
    const finStr = this.finSearch;

    this.infrastructureService.searchInfrastructures(
        0, // Page par défaut (ajuster si pagination activée)
        100, // Limite par défaut (ajuster si pagination activée)
        nom,
        numero,
        this.localisationIds,
        this.modelesIds,
        categorieInfraId,
        debutStr,
        finStr
    ).subscribe({
      next: (page) => {
        this.items = page.content;
        // Filter out infrastructures that are in infrastructureNotInSelections
        this.filteredItems = this.items.filter(
            item => !this.infrastructureNotInSelections.some(notSelected => notSelected.id === item.id)
        );
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
    this.localisationSelectionned = {};
    this.modelesInfraSelectionned = {};
    this.localisationIds = [];
    this.modelesIds = [];
    this.debutSearch = '2025-01-01T00:00';
    this.finSearch = '2025-01-02T00:00';
    this.loadInfrastructures(); // Recharger les données par défaut
  }

  showSuccessMessage(message: string) {
    this.toastr.success(message);
  }

  showErrorMessage(message: string) {
    this.toastr.error(message);
  }

  closeToast() {
    // No need to manually close toastr notifications as they auto-close
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
    this.newItem.modeleInfra = { id: '', nom: '', catInfra: { id: '', nom: '' } };
  }
}