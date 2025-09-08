import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  @ViewChild('clientForm') clientForm!: NgForm;

  typeClients: TypeClient[] = [];
  isEntreprise: boolean = false;
  client: Client = new Client();
  contactsValid: boolean = true;
  emailValid: boolean = true;
  cinValid: boolean = true;
  contactsFormatError: boolean = false;
  contactsDuplicateError: boolean = false;
  invalidContacts: string[] = [];
  duplicateContacts: string[] = [];

  constructor(
      private typeClientService: TypeClientService,
      private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.client.typeClient.id = '';
    this.loadTypeClients();
  }

  onTypeClientChange(typeClientId: string) {
    const selectedType = this.typeClients.find(type => type.id === typeClientId);
    this.isEntreprise = selectedType?.typeClient === 'Entreprise';
    if (this.isEntreprise) {
      this.client.nom = '';
      this.client.prenom = '';
      this.client.cin = '';
    } else {
      this.client.raisonSociale = '';
    }
    this.validateField('typeClient');
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
    this.clientForm.control.markAllAsTouched();
    this.validateField('typeClient');
    this.validateField('nom');
    this.validateField('raisonSociale');
    this.validateField('adresse');
    this.validateField('cin');
    this.verifContacts();
    this.verifEmail();

    if (this.clientForm.valid && this.contactsValid && this.emailValid && this.cinValid) {
      const obj: Client = this.client;
      this.formSubmit.emit(obj);
    }
  }

  verifEmail(): boolean {
    const email = this.client.email;
    if (!email) {
      this.emailValid = true;
      return true;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValid = regex.test(email);
    return this.emailValid;
  }

  verifContacts(): boolean {
    this.contactsFormatError = false;
    this.contactsDuplicateError = false;
    this.invalidContacts = [];
    this.duplicateContacts = [];

    let numeros: string = this.client.contacts;
    if (!numeros) {
      this.contactsValid = false;
      return false;
    }

    if (numeros.includes(",") || numeros.includes(" ")) {
      this.contactsValid = false;
      return false;
    }

    let liste = numeros.split(";").map(num => num.trim()).filter(num => num !== "");
    const regex = /^(0\d{8,9}|\+261\d{8,9})$/;
    let invalids = liste.filter(num => !regex.test(num));
    if (invalids.length > 0) {
      this.contactsValid = false;
      this.contactsFormatError = true;
      this.invalidContacts = invalids;
      return false;
    }

    let duplicates = liste.filter((num, index) => liste.indexOf(num) !== index);
    if (duplicates.length > 0) {
      this.contactsValid = false;
      this.contactsDuplicateError = true;
      this.duplicateContacts = [...new Set(duplicates)];
      return false;
    }

    this.contactsValid = true;
    return true;
  }

  validateField(field: string) {
    if (field === 'cin' && this.client.cin) {
      this.cinValid = /^\d{12,}$/.test(this.client.cin.toString());
    } else if (field === 'cin' && !this.client.cin) {
      this.cinValid = true; // CIN is optional
    } else if (field === 'nom' && !this.client.nom && !this.isEntreprise) {
      this.clientForm.form.get('nom')?.setErrors({ required: true });
    } else if (field === 'raisonSociale' && !this.client.raisonSociale && this.isEntreprise) {
      this.clientForm.form.get('raisonSociale')?.setErrors({ required: true });
    } else if (field === 'adresse' && !this.client.adresse) {
      this.clientForm.form.get('adresse')?.setErrors({ required: true });
    } else if (field === 'typeClient' && !this.client.typeClient.id) {
      this.clientForm.form.get('typeClient')?.setErrors({ required: true });
    }
  }

  cancelForm() {
    this.formCancel.emit();
    this.client = new Client();
    this.contactsValid = true;
    this.emailValid = true;
    this.cinValid = true;
    this.contactsFormatError = false;
    this.contactsDuplicateError = false;
    this.invalidContacts = [];
    this.duplicateContacts = [];
    this.clientForm?.resetForm();
  }

  protected readonly TypeClient = TypeClient;
  protected readonly Client = Client;
}