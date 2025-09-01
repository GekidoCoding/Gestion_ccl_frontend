import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Client } from '../../../model/client/client';
import { TypeClient } from '../../../model/type-client/type-client';
import { TypeClientService } from '../../../services/type-client/type-client.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-add-form',
  templateUrl: './client-add-form.component.html',
  styleUrls: ['./client-add-form.component.scss']
})
export class ClientAddFormComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Output() formSubmit = new EventEmitter<Client>();
  @Output() formCancel = new EventEmitter<void>();

  typeClients: TypeClient[] = [];
  isEntreprise: boolean = false;
  client: Client = new Client();

  constructor(
      private typeClientService: TypeClientService,
      private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadTypeClients();
  }

  onTypeClientChange(typeClientId: string) {
    const selectedType = this.typeClients.find(type => type.id === typeClientId);
    this.isEntreprise = selectedType?.typeClient === 'Entreprise';
    console.log('isEntreprise:', this.isEntreprise);
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

  submitForm() {
    const obj: Client = this.client;
    this.formSubmit.emit(obj);
  }

  public verifContacts(): boolean {
    let numeros: string = this.client.contacts;
    if (!numeros) return false;
    let liste = numeros.split(",").map(num => num.trim());
    return liste.every(num => {
      const regex = /^(0\d{8,9}|\+261\d{8,9})$/;
      return regex.test(num);
    });
  }


  cancelForm() {
    this.formCancel.emit();
    this.client = new Client();
  }

  protected readonly TypeClient = TypeClient;
}