import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { BaseCrudComponent, Page } from '../../components/base/base-crud.component';
import { Infrastructure } from '../../model/infrastructure/infrastructure';
import { InfrastructureService } from '../../services/infrastructure/infrastructure.service';
import { Localisation } from '../../model/localisation/localisation';
import { Etat } from '../../model/etat/etat';
import { LocalisationService } from '../../services/localisation/localisation.service';
import { EtatService } from '../../services/etat/etat.service';
import { ModeleInfra } from '../../model/modele-infra/modele-infra';
import { ModeleInfraService } from '../../services/modele-infra/modele-infra.service';
import { CategorieInfra } from '../../model/categorie-infra/categorie-infra';
import { CategorieInfraService } from '../../services/categorie-infra/categorie-infra.service';
import { ToastrService } from 'ngx-toastr';
import { DetailInfrastructureComponent } from '../../components/application/detail-infrastructure/detail-infrastructure.component';
import {
  InfrastructureAddFormComponent
} from "../../components/application/infrastructure-add-form/infrastructure-add-form.component";
import {
  InfraTarifListpopupComponent
} from "../../components/application/infra-tarif-listpopup/infra-tarif-listpopup.component";

@Component({
  selector: 'app-infra-crud',
  templateUrl: './infrastructure.component.html',
  styleUrls: ['./infrastructure.component.scss']
})
export class InfrastructureComponent extends BaseCrudComponent<Infrastructure> implements OnInit {
  localisations: Localisation[] = [];
  etats: Etat[] = [];
  categories: CategorieInfra[] = [];
  modeles: ModeleInfra[] = [];
  filteredModeles: ModeleInfra[] = [];
  newItem: Partial<Infrastructure> = this.initializeNewItem();
  selectedItem: Infrastructure | null = null;
  searchCriteria: Infrastructure = new Infrastructure();
  localisationSelectionned: { [key: string]: boolean } = {};
  modelesInfraSelectionned: { [key: string]: boolean } = {};
  localisationIds: string[] = [];
  modelesIds: string[] = [];
  debutSearch :string='';
  finSearch:string='';
  observation: string = '';

  constructor(
      modalService: NgbModal,
      private service: InfrastructureService,
      private localisationService: LocalisationService,
      private etatService: EtatService,
      private modeleInfraService: ModeleInfraService,
      private catInfraService: CategorieInfraService,
      protected toastr: ToastrService,
      private router: Router
  ) {
    super(modalService, toastr);
  }

  ngOnInit() {
    this.loadLocalisations();
    this.loadEtats();
    this.loadCategories();
    this.loadModeles();
    this.loadData();
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  loadLocalisations() {
    this.localisationService.getAll().subscribe({
      next: (localisations) => this.localisations = localisations,
      error: (error) => {
        console.error('Error loading localisations:', error);
        this.showErrorMessage('Erreur lors du chargement des localisations');
      }
    });
  }

  loadEtats() {
    this.etatService.getAll().subscribe({
      next: (etats) => this.etats = etats,
      error: (error) => {
        console.error('Error loading etats:', error);
        this.showErrorMessage('Erreur lors du chargement des états');
      }
    });
  }

  loadCategories() {
    this.catInfraService.getAll().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => {
        console.error('Error loading categories:', error);
        this.showErrorMessage('Erreur lors du chargement des catégories');
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
        this.showErrorMessage('Erreur lors du chargement des modèles');
      }
    });
  }

  loadData() {
    this.isLoading = true;
    this.service.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (page: Page<Infrastructure>) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading infrastructures:', error);
        this.showErrorMessage('Erreur lors du chargement des infrastructures');
        this.isLoading = false;
      }
    });
  }

  public applySearch(): void {
    this.isLoading = true;

    const nom = this.searchCriteria.nom?.trim() || undefined;
    const numero = this.searchCriteria.numero?.trim() || undefined;

    const categorieInfraId = this.searchCriteria.modeleInfra?.catInfra?.id || undefined;

    this.localisationIds = Object.keys(this.localisationSelectionned)
        .filter(id => this.localisationSelectionned[id]);

    this.modelesIds = Object.keys(this.modelesInfraSelectionned)
        .filter(id => this.modelesInfraSelectionned[id]);

    const debutStr:string = this.debutSearch;
    const finStr:string = this.finSearch;

    this.service.searchInfrastructures(
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
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.isLoading = false;
        // this.showSuccessMessage('Filtrage appliqué avec succès');
      },
      error: (error) => {
        // console.error('Erreur lors de l\'application des filtres:', error);
        this.showErrorMessage('Erreur lors de l\'application des filtres');
        this.isLoading = false;
      }
    });
  }


  initializeNewModeleInfra(): ModeleInfra {
    const newModele: ModeleInfra = new ModeleInfra();
    newModele.catInfra = new CategorieInfra();
    return newModele;
  }

  initializeNewItem(): Partial<Infrastructure> {
    return new Infrastructure();
  }

  resetSearchCriteria(): Partial<Infrastructure> {
    this.localisationSelectionned = {};
    this.modelesInfraSelectionned = {};
    this.localisationIds = [];
    this.modelesIds = [];
    return new Infrastructure();
  }

  addItem(infrastructure: Infrastructure) {
    this.service.create(infrastructure).subscribe({
      next: () => {
        this.currentPage = 0;
        this.loadData();
        this.showSuccessMessage('Infrastructure ajoutée avec succès !');
        this.newItem = this.initializeNewItem();
      },
      error: (error) => {
        console.error('Error adding infrastructure:', error);
        this.showErrorMessage('Erreur lors de l\'ajout de l\'infrastructure');
      }
    });
  }

  openAddModalPopup() {
    this.newItem = this.initializeNewItem();
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const modalComponent = this.modalService.open(InfrastructureAddFormComponent, options);
    modalComponent.componentInstance.newItem = this.newItem;
    modalComponent.componentInstance.localisations = this.localisations;
    modalComponent.componentInstance.etats = this.etats;
    modalComponent.componentInstance.categories = this.categories;
    modalComponent.componentInstance.filteredModeles = this.filteredModeles;
    modalComponent.componentInstance.submitForm.subscribe((event: any) => {
      this.addItem(event);
      modalComponent.close('Save click');
    });
    modalComponent.componentInstance.cancel.subscribe(() => {
      modalComponent.dismiss('Cancel click');
    });
    // modalComponent.componentInstance.categoryChange.subscribe((event: any) => {
    //   this.onCategoryChange(event);
    // });
  }

  navigateToDetail(id: string) {
    const modalRef = this.modalService.open(DetailInfrastructureComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.infrastructureId = id;
  }
  openTarifsComponent(id: string) {
    const modalRef = this.modalService.open(InfraTarifListpopupComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.infrastructureId = id;
  }

  navigateToMovements(id: string) {
    this.router.navigate([`/general/mouvement/infrastructure/${id}`]);
  }

  deleteSelectedItems(modal: any) {
    const deleteObservables = Object.keys(this.selectedIds).map(id => this.service.delete(id));
    Promise.all(deleteObservables.map(obs => obs.toPromise())).then(() => {
      this.currentPage = 0;
      this.loadData();
      this.selectedIds = {};
      this.selectAll = false;
      this.isSelectionMode = false;
      modal.close();
      this.showSuccessMessage('Infrastructures supprimées avec succès !');
    }).catch(error => {
      console.error('Erreur lors de la suppression des infrastructures:', error);
      this.showErrorMessage('Erreur lors de la suppression des infrastructures');
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
    if (this.selectedItem) this.selectedItem.modeleInfra = { id: '', nom: '', catInfra: { id: '', nom: '' } };
    if (this.newItem.modeleInfra) this.newItem.modeleInfra = { id: '', nom: '', catInfra: { id: '', nom: '' } };
  }

  updateLocalisationSelection(localisationId: string) {
    this.localisationIds = Object.keys(this.localisationSelectionned).filter(id => this.localisationSelectionned[id]);
  }

  updateModeleSelection(modeleId: string) {
    this.modelesIds = Object.keys(this.modelesInfraSelectionned).filter(id => this.modelesInfraSelectionned[id]);
  }
}