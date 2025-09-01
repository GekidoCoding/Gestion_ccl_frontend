import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseCrudComponent } from '../../components/base/base-crud.component';
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
import { DetailInfrastructureComponent } from '../../components/application/detail-infrastructure/detail-infrastructure.component';
import { HistoriqueMvtPopupComponent } from '../../components/application/historique-mvt-popup/historique-mvt-popup.component';
import { MouvementDetailComponent } from '../../components/application/mouvement-detail/mouvement-detail.component';
import { ClientDetailComponent } from '../../components/application/client-detail/client-detail.component';
import { CategorieInfraService } from '../../services/categorie-infra/categorie-infra.service';
import { CategorieInfra } from '../../model/categorie-infra/categorie-infra';
import { MouvementAddComponent } from '../../components/application/mouvement-add/mouvement-add.component';
import {MouvementInfrasPopupComponent} from "../../components/application/mouvement-infras-popup/mouvement-infras-popup/mouvement-infras-popup.component";

@Component({
  selector: 'app-mouvement',
  templateUrl: './mouvement.component.html',
  styleUrls: ['./mouvement.component.scss']
})
export class MouvementComponent extends BaseCrudComponent<Mouvement> implements OnInit {
  client: Client = new Client();
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
  periodeDebut: string = '';
  periodeFin: string = '';

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
    this.type = this.route.snapshot.paramMap.get('type') || '';
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.loadMain();
    this.loadTypeMouvements();
    this.loadClients();
    this.loadCategories();
    this.loadTypeClients();
    this.loadGestionnaires();
    this.loadEtats();
    this.loadData();
  }

  loadMain() {
    if (this.type === 'client') {
      console.log("client ... :" + this.id);
      this.loadClient(this.id);
    }
  }

  loadClient(id: string) {
    if (id) {
      this.clientService.getById(id).subscribe({
        next: (data) => {
          this.client = data;
          this.newItem.client = this.client;
        },
        error: (error) => {
          console.error('Error loading client:', error);
          this.toastr.error('Erreur lors du chargement du client');
        }
      });
    }
  }

  loadTypeMouvements() {
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
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types de mouvement:', error);
        this.toastr.error('Erreur lors du chargement des types de mouvement');
      }
    });
  }

  loadClients() {
    this.clientService.getAll().subscribe({
      next: (clients) => this.clients = clients,
      error: (error) => {
        console.error('Error loading clients:', error);
        this.toastr.error('Erreur lors du chargement des clients');
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
    this.gestionnaireService.getAll().subscribe({
      next: (gestionnaires) => this.gestionnaires = gestionnaires,
      error: (error) => {
        console.error('Error loading gestionnaires:', error);
        this.toastr.error('Erreur lors du chargement des gestionnaires');
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

  loadAll() {
    this.loadMain();
    this.loadClients();
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    if (this.type === 'client') {
      console.log("client loading ... ");
      this.mouvementService.getByClientPaginated(this.id, this.currentPage, this.itemsPerPage).subscribe({
        next: (page: Page<Mouvement>) => {
          this.items = page.content;
          this.totalPages = page.totalPages;
          this.totalItems = page.totalElements;
          this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          this.latestMovement = (this.items.length > 0 ? this.items[0].dhMouvement.replace("T", " ") : null);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading mouvements:', error);
          this.toastr.error('Erreur lors du chargement des mouvements');
          this.isLoading = false;
        }
      });
    } else {
      console.log("here ... ");
      this.mouvementService.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
        next: (page: Page<Mouvement>) => {
          this.items = page.content;
          this.totalPages = page.totalPages;
          this.totalItems = page.totalElements;
          this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          this.latestMovement = (this.items.length > 0 ? this.items[0].dhMouvement.replace("T", " ") : null);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading mouvements:', error);
          this.toastr.error('Erreur lors du chargement des mouvements');
          this.isLoading = false;
        }
      });
    }
  }

  public applySearch(): void {
    this.searchCriteria.periodeDebut = this.periodeDebut;
    this.searchCriteria.periodeFin = this.periodeFin;
    this.mouvementService.getCriteria(this.currentPage, this.itemsPerPage, this.searchCriteria).subscribe({
      next: (page: Page<Mouvement>) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.latestMovement = (this.items.length > 0 ? this.items[0].dhMouvement.replace("T", " ") : null);
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

  getTypeMouvement(): TypeMouvement {
    const searching = "Renseignement".toLowerCase().replace(" ", "");
    if (!this.typeMouvements || this.typeMouvements.length === 0) {
      this.showErrorMessage("Veuillez insérer un TypeMouvement avec nom Renseignement");
    }
    const foundType = this.typeMouvements.find(type => type.nom.toLowerCase().replace(" ", "") === searching) || new TypeMouvement();
    if (!foundType) {
      this.showErrorMessage("Veuillez insérer un TypeMouvement avec nom Renseignement");
    }
    return foundType;
  }

  openAddModal() {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(MouvementAddComponent, options);
    component.componentInstance.client = this.client;
    component.componentInstance.afterAdd.subscribe(() => this.loadAll());
  }

  openMouvementDetail(mouvementId: string) {
    const modal = this.modalService.open(MouvementDetailComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modal.componentInstance.mouvementId = mouvementId;
    modal.componentInstance.afterAction.subscribe(() => {
      this.loadAll();
    });
  }

  openInfrasPopup(mouvement: Mouvement) {
    const modal = this.modalService.open(MouvementInfrasPopupComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modal.componentInstance.mouvementInfras = mouvement.mouvementInfras || [];
    modal.componentInstance.mouvementId = mouvement.id;
    modal.componentInstance.afterEmit.subscribe(() => {
      this.loadAll();
    })
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

  handleAddMouvement(mouvement: Mouvement) {
    console.log("mouvement in handle :" + JSON.stringify(mouvement));
    this.mouvementService.create(mouvement).subscribe({
      next: (created) => {
        this.loadData();
        this.toastr.success('Mouvement ajouté avec succès !');
      },
      error: (error) => {
        console.error('Error adding mouvement:', error);
        this.toastr.error('Erreur lors de l\'ajout du mouvement');
      }
    });
  }

  handleClientAdd(client: Client) {
    this.clientService.create(client).subscribe({
      next: (created) => {
        this.loadClients();
        this.toastr.success('Client ajouté avec succès !');
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
}