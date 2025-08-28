import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BaseCrudComponent, Page } from '../../components/base/base-crud.component';
import { Client } from '../../model/client/client';
import { ClientService } from '../../services/client/client.service';
import { TypeClientService } from '../../services/type-client/type-client.service';
import { TypeClient } from '../../model/type-client/type-client';
import { ToastrService } from 'ngx-toastr';
import {ClientDetailComponent} from "../../components/application/client-detail/client-detail.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['../../components/base/base-crud.component.scss']
})
export class ClientComponent extends BaseCrudComponent<Client> implements OnInit {
  typeClients: TypeClient[] = [];
  selectedItem: Client = new Client();
  searchCriteria: Client = new Client();
  selectedInfrastructureIds: string[] = [];

  constructor(
      modalService: NgbModal,
      private service: ClientService,
      private typeClientService: TypeClientService,
      protected toastr: ToastrService ,
      private router:Router,
  ) {
    super(modalService, toastr);
  }

  ngOnInit() {
    this.loadData();
    this.loadTypeClients();
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  loadData() {
    this.isLoading = true;
    this.service.getPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (page: Page<Client>) => {
        this.items = page.content;
        this.totalPages = page.totalPages;
        this.totalItems = page.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.showErrorMessage('Erreur lors du chargement des clients');
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
        this.showErrorMessage('Erreur lors du chargement des types de client');
        this.isLoading = false;
      }
    });
  }

  protected applyFilters(items: Client[]): Client[] {
    let result = [...items];
    if (this.searchCriteria.id) {
      result = result.filter(item => item.id.toLowerCase().includes(this.searchCriteria.id!.toLowerCase()));
    }
    if (this.searchCriteria.nom) {
      const searchTerm = this.searchCriteria.nom.toLowerCase();
      result = result.filter(item =>
          item.nom.toLowerCase().includes(searchTerm) ||
          item.raisonSociale.toLowerCase().includes(searchTerm)
      );
    }
    return result;
  }

  protected isDateColumn(column: keyof Client): boolean {
    return false;
  }

  initializeNewItem(): Partial<Client> {
    return new Client();
  }

  resetSearchCriteria(): Partial<Client> {
    return new Client();
  }

  handleAddFormSubmit(client: Client) {
    this.service.create(client).subscribe({
      next: (created) => {
        this.currentPage = 0;
        this.loadData();
        this.showSuccessMessage('Client ajouté avec succès !');
      },
      error: (error) => {
        console.error('Error adding client:', error);
        this.showErrorMessage('Erreur lors de l\'ajout du client');
      }
    });
  }

  confirmUpdate(client: Client) {
    this.service.update(client.id, client).subscribe({
      next: (updated) => {
        this.currentPage = 0;
        this.loadData();
        this.showSuccessMessage('Modification réussie !');
      },
      error: (error) => {
        console.error('Error updating client:', error);
        this.showErrorMessage('Erreur lors de la modification du client');
      }
    });
  }

  openDetailModal(item:Client) {
      const options :NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
      const component =  this.modalService.open(ClientDetailComponent, options);
      component.componentInstance.clientId = item.id;
      component.componentInstance.loadData.subscribe(() => {
        this.loadData();
      });
  }

  openUpdateModal(content: any, item: Client) {
    this.selectedItem = { ...item, typeClient: { ...item.typeClient }, etat: { ...item.etat } };
    this.typeClientService.getPersonneId().subscribe(personneId => {
      this.selectedItem.typeClient.id !== personneId;
    });
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  deleteSelectedItems(modal: any) {
    const deleteObservables = Object.keys(this.selectedIds).map(id =>
        this.service.delete(id)
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
      console.error('Error deleting clients:', error);
      this.showErrorMessage('Erreur lors de la suppression des clients : La suppression de clients liés à des mouvements n\'est pas autorisée.');
    });
  }
  navigateToMovements(id: string) {
    this.router.navigate([`/general/mouvement/client/${id}`]);
  }
  applySearch() {
    this.service.searchClients(this.searchCriteria, this.selectedInfrastructureIds, this.currentPage, this.itemsPerPage)
        .subscribe(result => {
          this.items = result.content;
          this.totalPages = result.totalPages;
          this.totalItems = result.totalElements;
          this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          this.isLoading = false;
        });
  }


}