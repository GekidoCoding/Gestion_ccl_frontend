import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { BaseCrudComponent, Page } from '../../base/base-crud.component';
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
import { DetailInfrastructureComponent } from '../../components/infrastructure/detail-infrastructure/detail-infrastructure.component';
import {
  InfrastructureAddFormComponent
} from "../../components/infrastructure/infrastructure-add-form/infrastructure-add-form.component";
import {
  InfraTarifListpopupComponent
} from "../../components/infrastructure/infra-tarif-listpopup/infra-tarif-listpopup.component";
import {YesNoWarningComponent} from "../../components/yes-no-warning/yes-no-warning.component";
import {InfrastructureUtil} from "../../util/infrastructure.util";
import {Observable} from "rxjs";
import {Client} from "../../model/client/client";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-infra-crud',
  templateUrl: './infrastructure.component.html',
  styleUrls: ['./infrastructure.component.scss']
})
export class InfrastructureComponent extends BaseCrudComponent<Infrastructure> implements OnInit {

  allItems:Infrastructure[]=[];
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

  designationCtrl=new FormControl('');
  filteredDesignations: Observable<Infrastructure[]>;

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
    this.filteredDesignations = this.designationCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterDesignations(value || ''))
    );
  }

  ngOnInit() {
    this.loadAllItems();
    this.loadLocalisations();
    this.loadEtats();
    this.loadCategories();
    this.loadModeles();
    this.loadData();
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }
  loadAllItems(){
    this.service.getAll().subscribe({
      next:(data)=>{
        this.allItems = data;
      }
    })
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

  getVisiblePageNumbers(totalPages: number, currentPage: number): number[] {
    console.log(`totalPages:${totalPages} , currentPage: ${currentPage} `);
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
  loadData() {
    this.isLoading = true;
    this.service.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (page: Page<Infrastructure>) => {
        console.log("page backend:"+JSON.stringify(page));
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = this.getVisiblePageNumbers(this.totalPages, this.currentPage + 1);  // Nouveau getter ci-dessous
        console.log("pagination ="+JSON.stringify(this.pageNumbers));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading infrastructures:', error);
        this.showErrorMessage('Erreur lors du chargement des infrastructures');
        this.isLoading = false;
      }
    });
  }
  public resetSearchForm(){
    this.searchCriteria=new Infrastructure();
    this.loadData();
  }
  public applySearches(): void {
    this.isLoading = true;
    const nom = this.designationCtrl.value;
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
      this.pageNumbers = this.getVisiblePageNumbers(this.totalPages, this.currentPage + 1);  // Nouveau getter ci-dessous
        this.isLoading = false;
      },
      error: (error) => {
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


  create(infrastructure: Infrastructure) {
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

  addItem(infrastructure: Infrastructure) {
    this.service.checkInfrastructureSimilarity(infrastructure).subscribe({
      next: (data:Infrastructure[]) => {
        console.log(JSON.stringify(data));
        if(data.length>0){
            let message :string = InfrastructureUtil.getWarningMessageSimilarityFromList(data );
            let composant= this.modalService.open(YesNoWarningComponent );
            composant.componentInstance.message=message;
            composant.componentInstance.confirm.subscribe({
              next: () => {
                this.create(infrastructure);
              }
            });
            composant.componentInstance.decline.subscribe({
              next: () => {
                composant.close();
              }
            })
        }else{
          this.create(infrastructure);
        }
      },
      error: (error) => {
        this.showErrorMessage('Erreur lors de verification de similarite');
      }
    })

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
    });
    modalComponent.componentInstance.cancel.subscribe(() => {
      modalComponent.dismiss('Cancel click');
    });

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
    this.router.navigate([`/cnaps/gestion/ccl/mouvement/infrastructure/${id}`]);
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
    if (this.selectedItem) this.selectedItem.modeleInfra = new ModeleInfra();
    if (this.newItem.modeleInfra) this.newItem.modeleInfra =new ModeleInfra();
  }

  updateLocalisationSelection(localisationId: string) {
    this.localisationIds = Object.keys(this.localisationSelectionned).filter(id => this.localisationSelectionned[id]);
  }

  updateModeleSelection(modeleId: string) {
    this.modelesIds = Object.keys(this.modelesInfraSelectionned).filter(id => this.modelesInfraSelectionned[id]);
  }
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page - 1;
      this.applySearch();
      this.showConfirmation = false;
    }
  }
  displayValueFn(value: string): string {
    return value ;
  }
  private _filterDesignations(value: string): Infrastructure[] {
    const filterValue = value.toLowerCase();
    return this.allItems.filter(item =>
        item.nom.toLowerCase().includes(filterValue)
    );
  }

}