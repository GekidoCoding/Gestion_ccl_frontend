import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {Client} from "../../../model/client/client";
import {TypeClient} from "../../../model/type-client/type-client";
import {ClientService} from "../../../services/client/client.service";
import {TypeClientService} from "../../../services/type-client/type-client.service";
import {ClientDetailComponent} from "../client-detail/client-detail.component";


@Component({
  selector: 'app-client-list',
  templateUrl: './client-list-popup.component.html',
  styleUrls: ['./client-list-popup.component.scss']
})
export class ClientListPopupComponent implements OnInit {

  @Input() clientSelected :Client | undefined = new Client();
  @Output() clientSelectedChange = new EventEmitter<Client>();

  items: Client[] = [];
  typeClients: TypeClient[] = [];
  isLoading = false;
  showConfirmation = false;
  confirmationMessage = '';
  showError = false;
  errorMessage = '';

  constructor(
      private modalService: NgbModal,
      private service: ClientService,
      private typeClientService: TypeClientService,
      private toastr: ToastrService,
      private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadTypeClients();
  }

  loadData() {
    this.isLoading = true;
    this.service.getAll().subscribe({
      next: (clients) => {
        this.items = clients;
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

  openAddModal(content: any) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }
  selectionnedClient(id: string) {
    this.clientSelected = this.items.find(item => item.id === id);
    if (this.clientSelected) {
      this.clientSelectedChange.emit(this.clientSelected); // Émettre l'événement avec le client sélectionné
      // this.modalService.dismissAll(); // Fermer la modale après sélection
    }
  }

  handleAddFormSubmit(client: Client) {
    this.service.create(client).subscribe({
      next: (created) => {
        this.loadData();
        this.showSuccessMessage('Client ajouté avec succès !');
      },
      error: (error) => {
        console.error('Error adding client:', error);
        this.showErrorMessage('Erreur lors de l\'ajout du client');
      }
    });
  }

  showSuccessMessage(message: string) {
    this.confirmationMessage = message;
    this.showConfirmation = true;
    setTimeout(() => this.closeToast(), 3000);
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
    this.showError = true;
    setTimeout(() => this.closeToast(), 3000);
  }

  closeToast() {
    this.showConfirmation = false;
    this.showError = false;
  }

  openDetailModal(item:Client) {
    const options :NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component =  this.modalService.open(ClientDetailComponent, options);
    component.componentInstance.clientId = item.id;
    component.componentInstance.loadData.subscribe(() => {
      this.loadData();
    });
  }

}