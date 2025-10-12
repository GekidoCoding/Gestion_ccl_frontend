import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Client } from '../../../model/client/client';
import { TypeClient } from '../../../model/type-client/type-client';
import { ClientService } from '../../../services/client/client.service';
import { TypeClientService } from '../../../services/type-client/type-client.service';
import { ClientDetailComponent } from '../client-detail/client-detail.component';
import { ClientAddFormComponent } from '../client-add-form/client-add-form.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {Page} from "../../../interface/page.interface";

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list-popup.component.html',
  styleUrls: ['./client-list-popup.component.scss']
})
export class ClientListPopupComponent implements OnInit {
  @Input() clientSelected: Client | undefined = new Client();
  @Output() clientSelectedChange = new EventEmitter<Client>();

  items: Client[] = [];
  allItems: Client[] = [];
  typeClients: TypeClient[] = [];
  searchCriteria: Client = new Client();
  isLoading = false;
  showConfirmation = false;
  confirmationMessage = '';
  showError = false;
  errorMessage = '';

  // Pagination properties
  currentPage: number = 0;
  totalPages: number = 0;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  pageNumbers: number[] = [];

  // Autocomplete properties
  designationCtrl = new FormControl('');
  contactsCtrl = new FormControl('');
  filteredDesignations: Observable<Client[]>;
  filteredContacts: Observable<Client[]>;

  constructor(
      private modalService: NgbModal,
      private service: ClientService,
      private typeClientService: TypeClientService,
      private toastr: ToastrService,
      private router: Router
  ) {
    this.filteredDesignations = this.designationCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterDesignations(value || ''))
    );
    this.filteredContacts = this.contactsCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterContacts(value || ''))
    );
  }

  ngOnInit() {
    this.loadAllItems();
    this.loadData();
    this.loadTypeClients();
  }

  private _filterDesignations(value: string | Client): Client[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.designationClient.toLowerCase();
    return this.allItems.filter(client =>
        client.designationClient.toLowerCase().includes(filterValue)
    );
  }

  private _filterContacts(value: string | Client): Client[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.contacts.toLowerCase();
    return this.allItems.filter(client =>
        client.contacts.toLowerCase().includes(filterValue)
    );
  }

  displayValueFn(value: string): string {
    return value;
  }

  onDesignationSelected(event: MatAutocompleteSelectedEvent) {
    const selectedClient: Client = event.option.value;
    this.designationCtrl.setValue(selectedClient.designationClient);
    this.searchCriteria.designationClient = selectedClient.designationClient;
  }

  onContactsSelected(event: MatAutocompleteSelectedEvent) {
    const selectedClient: Client = event.option.value;
    this.contactsCtrl.setValue(selectedClient.contacts);
    this.searchCriteria.contacts = selectedClient.contacts;
  }

  loadAllItems() {
    this.service.getAll().subscribe({
      next: (clients) => {
        this.allItems = clients;
      },
      error: (error) => {
        console.error('Error loading all clients:', error);
        this.showErrorMessage('Erreur lors du chargement des clients');
      }
    });
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

  applySearches() {
    this.isLoading = true;
    this.searchCriteria.designationClient = typeof this.designationCtrl.value === 'string'
        ? this.designationCtrl.value
        : this.designationCtrl.value?.designationClient || '';
    this.searchCriteria.contacts = typeof this.contactsCtrl.value === 'string'
        ? this.contactsCtrl.value
        : this.contactsCtrl.value?.contacts || '';
    this.service.searchClients(this.searchCriteria, [], this.currentPage, this.itemsPerPage).subscribe({
      next: (result: Page<Client>) => {
        this.items = result.content;
        this.totalPages = result.totalPages;
        this.totalItems = result.totalElements;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching clients:', error);
        this.showErrorMessage('Erreur lors de la recherche des clients');
        this.isLoading = false;
      }
    });
  }

  resetSearchForm() {
    this.searchCriteria = new Client();
    this.designationCtrl.setValue('');
    this.contactsCtrl.setValue('');
    this.currentPage = 0; // Reset to first page
    this.loadData();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page - 1; // Convert to 0-based for API
      this.applySearches();
    }
  }

  openAddModal() {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const composant = this.modalService.open(ClientAddFormComponent, options);
    composant.componentInstance.loadData.subscribe(() => {
      this.currentPage = 0; // Reset to first page
      this.loadData();
      this.loadAllItems(); // Reload allItems to update autocomplete suggestions
    });
  }

  selectionnedClient(id: string) {
    this.clientSelected = this.items.find(item => item.id === id);
    if (this.clientSelected) {
      this.clientSelectedChange.emit(this.clientSelected);
      // this.modalService.dismissAll(); // Uncomment if you want to close the modal after selection
    }
  }

  handleAddFormSubmit(client: Client) {
    this.service.create(client).subscribe({
      next: (created) => {
        this.currentPage = 0; // Reset to first page
        this.loadData();
        this.loadAllItems(); // Reload allItems to update autocomplete suggestions
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

  openDetailModal(item: Client) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(ClientDetailComponent, options);
    component.componentInstance.clientId = item.id;
    component.componentInstance.loadData.subscribe(() => {
      this.currentPage = 0; // Reset to first page
      this.loadData();
      this.loadAllItems(); // Reload allItems to update autocomplete suggestions
    });
  }
}