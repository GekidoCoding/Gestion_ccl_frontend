import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseCrudComponent } from '../../base/base-crud.component';
import { Mouvement } from '../../model/mouvement/mouvement';
import { MouvementService } from '../../services/mouvement/mouvement.service';
import { InfrastructureService } from '../../services/infrastructure/infrastructure.service';
import { TypeMouvement } from '../../model/type-mouvement/type-mouvement';
import { Client } from '../../model/client/client';
import { Gestionnaire } from '../../model/gestionnaire/gestionnaire';
import { Etat } from '../../model/etat/etat';
import { ClientService } from '../../services/client/client.service';
import { GestionnaireService } from '../../services/gestionnaire/gestionnaire.service';
import { EtatService } from '../../services/etat/etat.service';
import { TypeClientService } from '../../services/type-client/type-client.service';
import { TypeClient } from '../../model/type-client/type-client';
import { Page } from '../../interface/page.interface';
import { TypeMouvementService } from '../../services/type-mouvement/type-mouvement.service';
import { DetailInfrastructureComponent } from '../../components/infrastructure/detail-infrastructure/detail-infrastructure.component';
import { HistoriqueMvtPopupComponent } from '../../components/historique/historique-mvt-popup/historique-mvt-popup.component';
import { MouvementDetailComponent } from '../../components/mouvement/mouvement-detail/mouvement-detail.component';
import { ClientDetailComponent } from '../../components/client/client-detail/client-detail.component';
import { CategorieInfraService } from '../../services/categorie-infra/categorie-infra.service';
import { CategorieInfra } from '../../model/categorie-infra/categorie-infra';
import { MouvementAddComponent } from '../../components/mouvement/mouvement-add/mouvement-add.component';
import { MouvementInfrasPopupComponent } from '../../components/mouvement/mouvement-infras-popup/mouvement-infras-popup.component';
import { Infrastructure } from '../../model/infrastructure/infrastructure';
import {MouvementInfra} from "../../model/mouvement-infra/mouvement-infra";

@Component({
  selector: 'app-mouvement',
  templateUrl: './mouvement.component.html',
  styleUrls: ['./mouvement.component.scss']
})
export class MouvementComponent extends BaseCrudComponent<Mouvement> implements OnInit {
  client: Client = new Client();
  infrastructure: Infrastructure = new Infrastructure();
  typeMouvements: TypeMouvement[] = [];
  clients: Client[] = [];
  typeClients: TypeClient[] = [];
  gestionnaires: Gestionnaire[] = [];
  etats: Etat[] = [];
  type: string = 'all';
  id: string = '';
  newItem: Mouvement = new Mouvement();
  latestMovement: string | null = null;
  categories: CategorieInfra[] = [];
  searchCriteria: Mouvement = new Mouvement();

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      modalService: NgbModal,
      private mouvementService: MouvementService,
      private infrastructureService: InfrastructureService,
      private typeMouvementService: TypeMouvementService,
      private clientService: ClientService,
      private gestionnaireService: GestionnaireService,
      private etatService: EtatService,
      private typeClientService: TypeClientService,
      private catInfraService: CategorieInfraService,
      protected toastr: ToastrService
  ) {
    super(modalService, toastr);
  }

  ngOnInit() {
    this.searchCriteria.id = 'MVT-';
    this.searchCriteria.typeMouvement.id='';
    this.type = this.route.snapshot.paramMap.get('type') || 'all';
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.loadTypeMouvements();
    this.loadClients();
    this.loadCategories();
    this.loadTypeClients();
    this.loadGestionnaires();
    this.loadEtats();
    this.loadMain();
    this.loadData();
  }

  loadMain() {
    if (this.type === 'client') {
      this.loadClient(this.id);
    } else if (this.type === 'infrastructure') {
      this.loadInfrastrcuture(this.id);
    }
  }

  loadClient(id: string) {
    if (id) {
      this.isLoading = true;
      this.clientService.getById(id).subscribe({
        next: (data) => {
          this.client = data;
          this.newItem.client = this.client;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading client:', error);
          this.toastr.error('Erreur lors du chargement du client');
          this.isLoading = false;
        }
      });
    }
  }

  loadInfrastrcuture(id: string) {
    if (id) {
      this.isLoading = true;
      this.infrastructureService.getById(id).subscribe({
        next: (data) => {
          this.infrastructure = data;
          this.newItem.infrastructure = this.infrastructure;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading infrastructure:', error);
          this.toastr.error('Erreur lors du chargement de l\'infrastructure');
          this.isLoading = false;
        }
      });
    }
  }

  loadTypeMouvements() {
    this.isLoading = true;
    this.typeMouvementService.getAll().subscribe({
      next: (types) => {
        this.typeMouvements = types;
        try {
          const typeMouvement = this.getTypeMouvement();
          this.newItem.typeMouvement.id = typeMouvement.id;
        } catch (error) {
          console.error('Erreur lors de la récupération du TypeMouvement:', error);
          this.toastr.error('Erreur lors de la récupération du TypeMouvement');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types de mouvement:', error);
        this.toastr.error('Erreur lors du chargement des types de mouvement');
        this.isLoading = false;
      }
    });
  }

  loadClients() {
    this.isLoading = true;
    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.toastr.error('Erreur lors du chargement des clients');
        this.isLoading = false;
      }
    });
  }

  loadCategories() {
    this.isLoading = true;
    this.catInfraService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('Erreur lors du chargement des catégories');
        this.isLoading = false;
      }
    });
  }

  loadTypeClients() {
    this.isLoading = true;
    this.typeClientService.getAll().subscribe({
      next: (types) => {
        this.typeClients = types;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types de client:', error);
        this.toastr.error('Erreur lors du chargement des types de client');
        this.isLoading = false;
      }
    });
  }

  loadGestionnaires() {
    this.isLoading = true;
    this.gestionnaireService.getAll().subscribe({
      next: (gestionnaires) => {
        this.gestionnaires = gestionnaires;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading gestionnaires:', error);
        this.toastr.error('Erreur lors du chargement des gestionnaires');
        this.isLoading = false;
      }
    });
  }

  loadEtats() {
    this.isLoading = true;
    this.etatService.getAll().subscribe({
      next: (etats) => {
        this.etats = etats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading etats:', error);
        this.toastr.error('Erreur lors du chargement des états');
        this.isLoading = false;
      }
    });
  }

  loadData() {
    this.isLoading = true;
    if (this.type === 'client' && this.id) {
      console.log('Loading mouvements for client:', this.id);
      this.mouvementService.getByClientPaginated(this.id, this.currentPage, this.itemsPerPage).subscribe({
        next: (page: Page<Mouvement>) => {
          this.items = page.content;
          this.totalPages = page.totalPages;
          this.totalItems = page.totalElements;
          this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          this.latestMovement = this.items.length > 0 ? this.items[0].dhMouvement.replace('T', ' ') : null;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading mouvements for client:', error);
          this.toastr.error('Erreur lors du chargement des mouvements pour le client');
          this.isLoading = false;
        }
      });
    } else if (this.type === 'infrastructure' && this.id) {
      console.log('Loading mouvements for infrastructure:', this.id);
      this.mouvementService.getByInfrastructurePaginated(this.id, this.currentPage, this.itemsPerPage).subscribe({
        next: (page: Page<Mouvement>) => {
          this.items = page.content;
          this.totalPages = page.totalPages;
          this.totalItems = page.totalElements;
          this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          this.latestMovement = this.items.length > 0 ? this.items[0].dhMouvement.replace('T', ' ') : null;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading mouvements for infrastructure:', error);
          this.toastr.error('Erreur lors du chargement des mouvements pour l\'infrastructure');
          this.isLoading = false;
        }
      });
    } else {
      console.log('Loading all mouvements');
      this.mouvementService.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
        next: (page: Page<Mouvement>) => {
          this.items = page.content;
          this.totalPages = page.totalPages;
          this.totalItems = page.totalElements;
          this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          this.latestMovement = this.items.length > 0 ? this.items[0].dhMouvement.replace('T', ' ') : null;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading all mouvements:', error);
          this.toastr.error('Erreur lors du chargement des mouvements');
          this.isLoading = false;
        }
      });
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page - 1; // Convert to 0-based for API
      this.applySearch();
      this.showConfirmation = false;
    }
  }
  deleteSelectedItems(modal: any) {
    this.isLoading = true;
    const deleteObservables = Object.keys(this.selectedIds).map(id =>
        this.mouvementService.delete(id)
    );

    Promise.all(deleteObservables.map(obs => obs.toPromise())).then(() => {
      this.currentPage = 0;
      this.loadData();
      this.selectedIds = {};
      this.selectAll = false;
      this.isSelectionMode = false;
      modal.close();
      this.showSuccessMessage('Annulatin réussie !');
    }).catch(error => {
      console.error('Error deleting :', error);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  public applySearch(): void {
    this.isLoading = true;
    if(this.type=='client'){
      this.searchCriteria.client.id=this.client.id;
    }
    if(this.type=='infrastructure'){
      let mouvementInfra:MouvementInfra = new MouvementInfra();
      mouvementInfra.infrastructure.id = this.infrastructure.id;
      this.searchCriteria.mouvementInfras.push(mouvementInfra);
    }

    this.mouvementService.getCriteria(this.currentPage, this.itemsPerPage, this.searchCriteria).subscribe({
      next: (page: Page<Mouvement>) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.latestMovement = this.items.length > 0 ? this.items[0].dhMouvement.replace('T', ' ') : null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading mouvements:', error);
        this.toastr.error('Erreur lors du chargement des mouvements');
        this.isLoading = false;
      }
    });
  }

  initializeNewItem(): Partial<Mouvement> {
    return new Mouvement();
  }

  resetSearchCriteria(): Partial<Mouvement> {
    return new Mouvement();
  }

  resetSearchFormCriteria(): void {
    this.searchCriteria = new Mouvement();
    this.searchCriteria.id = 'MVT-';
    this.loadData(); // Changed to loadData instead of loadAll to avoid redundant calls
  }

  getTypeMouvement(): TypeMouvement {
    const searching = 'Renseignement'.toLowerCase().replace(' ', '');
    if (!this.typeMouvements || this.typeMouvements.length === 0) {
      this.showErrorMessage('Veuillez insérer un TypeMouvement avec nom Renseignement');
      throw new Error('TypeMouvement not found');
    }
    const foundType = this.typeMouvements.find(type => type.nom.toLowerCase().replace(' ', '') === searching) || new TypeMouvement();
    if (!foundType.id) {
      this.showErrorMessage('Veuillez insérer un TypeMouvement avec nom Renseignement');
      throw new Error('TypeMouvement not found');
    }
    return foundType;
  }

  openAddModal() {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(MouvementAddComponent, options);
    component.componentInstance.client = this.client;
    component.componentInstance.afterAdd.subscribe(() => this.loadData());
  }

  openMouvementDetail(mouvementId: string) {
    const modal = this.modalService.open(MouvementDetailComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modal.componentInstance.mouvementId = mouvementId;
    modal.componentInstance.afterAction.subscribe(() => {
      this.loadData();
    });
  }

  openInfrasPopup(mouvement: Mouvement) {
    const modal = this.modalService.open(MouvementInfrasPopupComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modal.componentInstance.mouvementInfras = mouvement.mouvementInfras || [];
    modal.componentInstance.mouvementId = mouvement.id;
    modal.componentInstance.afterEmit.subscribe(() => {
      this.loadData();
    });
  }

  navigateToDetailInfra(id: string) {
    const modal = this.modalService.open(DetailInfrastructureComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modal.componentInstance.infrastructureId = id;
    modal.componentInstance.loadData.subscribe(() => {
      this.loadData();
    });
  }

  navigateToDetailClient(id: string) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(ClientDetailComponent, options);
    component.componentInstance.clientId = id;
    component.componentInstance.loadData.subscribe(() => {
      this.loadData();
      this.loadClient(id);
    });
  }

  openDetailModal(item: Client) {}

  openClientAddModal(content: any) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  handleClientAdd(client: Client) {
    this.clientService.create(client).subscribe({
      next: (created) => {
        this.loadClients();
        this.toastr.success('Client ajouté avec succès !');
        this.loadData(); // Ensure data is reloaded after client creation
      },
      error: (error) => {
        console.error('Error adding client:', error);
        this.toastr.error('Erreur lors de l\'ajout du client');
      }
    });
  }

  sortByColumn(column: string) {
    if (this.sortConfig.column === column) {
      this.sortConfig.order = this.sortConfig.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.order = 'asc';
    }
  }

  openHistoriquePopup(mouvementId: string) {
    const modal = this.modalService.open(HistoriqueMvtPopupComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modal.componentInstance.mouvementId = mouvementId;
  }

  get filteredItems(): Mouvement[] {
    return this.items;
  }
}