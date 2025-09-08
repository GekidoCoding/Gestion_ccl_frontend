import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Client } from '../../../model/client/client';
import { TypeClient } from '../../../model/type-client/type-client';
import { ClientService } from '../../../services/client/client.service';
import { TypeClientService } from '../../../services/type-client/type-client.service';
import { MouvementAddComponent } from '../mouvement-add/mouvement-add.component';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {
  @Input() clientId!: string;
  @Output() loadData = new EventEmitter<void>();
  @ViewChild('detailForm') detailForm!: NgForm;

  selectedItem: Client = new Client();
  totalPersonnes = 0;
  totalMouvements = 0;
  typeClients: TypeClient[] = [];
  isEditing = false;
  isLoading = true;
  isEntreprise: boolean = false;
  contactsValid: boolean = true;
  emailValid: boolean = true;
  cinValid: boolean = true;
  contactsFormatError: boolean = false;
  contactsDuplicateError: boolean = false;
  invalidContacts: string[] = [];
  duplicateContacts: string[] = [];

  constructor(
      public activeModal: NgbActiveModal,
      private router: Router,
      private modalService: NgbModal,
      private service: ClientService,
      private typeClientService: TypeClientService,
      private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadTypeClients();
    this.loadClient();
    this.getTotalPersonnes();
    this.getTotalMouvements();
  }

  loadClient() {
    if (this.clientId) {
      this.service.getById(this.clientId).subscribe({
        next: (data) => {
          this.selectedItem = { ...data, typeClient: { ...data.typeClient }, etat: { ...data.etat } };
          this.onTypeClientChange();
          this.validateField('typeClient');
          this.validateField('nom');
          this.validateField('raisonSociale');
          this.validateField('adresse');
          this.validateField('cin');
          this.verifContacts();
          this.verifEmail();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading client details:', error);
          this.toastr.error('Erreur lors du chargement des détails du client');
          this.isLoading = false;
        }
      });
    }
  }

  loadTypeClients() {
    this.isLoading = true;
    this.typeClientService.getAll().subscribe({
      next: (types) => {
        this.typeClients = types;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading type clients:', error);
        this.toastr.error('Erreur lors du chargement des types de client');
        this.isLoading = false;
      }
    });
  }

  getTotalPersonnes() {
    this.isLoading = true;
    this.service.getTotalPersonnes(this.clientId).subscribe({
      next: (data) => {
        this.totalPersonnes = data;
        this.isLoading = false;
        if (this.totalPersonnes === this.totalMouvements) {
          console.warn('totalPersonnes equals totalMouvements, potential backend issue');
        }
      },
      error: (error) => {
        console.error('Error loading total personnes:', error);
        this.toastr.error('Erreur lors du chargement du total des personnes invitées par le client');
        this.isLoading = false;
      }
    });
  }

  getTotalMouvements() {
    this.isLoading = true;
    this.service.getTotalMouvements(this.clientId).subscribe({
      next: (data) => {
        this.totalMouvements = data;
        this.isLoading = false;
        if (this.totalPersonnes === this.totalMouvements) {
          console.warn('totalPersonnes equals totalMouvements, potential backend issue');
        }
      },
      error: (error) => {
        console.error('Error loading total mouvements:', error);
        this.toastr.error('Erreur lors du chargement du total des mouvements par le client');
        this.isLoading = false;
      }
    });
  }

  onTypeClientChange() {
    this.typeClientService.getPersonneId().subscribe({
      next: (personneId) => {
        this.isEntreprise = this.selectedItem.typeClient.id !== personneId;
        if (this.isEntreprise) {
          this.selectedItem.nom = '';
          this.selectedItem.prenom = '';
          this.selectedItem.cin = '';
        } else {
          this.selectedItem.raisonSociale = '';
        }
        this.validateField('typeClient');
        this.validateField('nom');
        this.validateField('raisonSociale');
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l’ID personne :', error);
        this.toastr.error('Erreur lors de la vérification du type de client');
      }
    });
  }

  toggleEditMode() {
    this.isEditing = true;
  }

  cancelEdit() {
   this.ngOnInit();
   this.isEditing = false;
  }

  update(form: NgForm) {
    this.detailForm.control.markAllAsTouched();
    this.validateField('typeClient');
    this.validateField('nom');
    this.validateField('raisonSociale');
    this.validateField('adresse');
    this.validateField('cin');
    this.verifContacts();
    this.verifEmail();

    if (form.valid && this.contactsValid && this.emailValid && this.cinValid) {
      const updatedClient: Client = {
        ...this.selectedItem,
        typeClient: this.typeClients.find(type => type.id === this.selectedItem.typeClient.id) || new TypeClient(),
        nom: !this.isEntreprise ? this.selectedItem.nom : '',
        prenom: !this.isEntreprise ? this.selectedItem.prenom : '',
        raisonSociale: this.isEntreprise ? this.selectedItem.raisonSociale : '',
        cin: !this.isEntreprise ? this.selectedItem.cin : '',
        adresse: this.selectedItem.adresse,
        contacts: this.selectedItem.contacts,
        // email: this.selectedItem.email,
        fonction: this.selectedItem.fonction
      };
      this.service.update(this.selectedItem.id, updatedClient).subscribe({
        next: () => {
          this.isEditing = false;
          this.loadData.emit();
          this.toastr.success('Client mis à jour avec succès !');
        },
        error: (error) => {
          console.error('Error updating client:', error);
          this.toastr.error('Erreur lors de la mise à jour du client');
        }
      });
    }
  }

  verifContacts(): boolean {
    this.contactsFormatError = false;
    this.contactsDuplicateError = false;
    this.invalidContacts = [];
    this.duplicateContacts = [];

    let numeros: string = this.selectedItem.contacts;
    if (!numeros) {
      this.contactsValid = false;
      return false;
    }

    if (numeros.includes(',') || numeros.includes(' ')) {
      this.contactsValid = false;
      return false;
    }

    let liste = numeros.split(';').map(num => num.trim()).filter(num => num !== '');
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

  verifEmail(): boolean {
    const email = this.selectedItem.email;
    if (!email) {
      this.emailValid = true;
      return true;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValid = regex.test(email);
    return this.emailValid;
  }

  validateField(field: string) {
    if (field === 'cin' && this.selectedItem.cin) {
      this.cinValid = /^\d{12,}$/.test(this.selectedItem.cin.toString());
    } else if (field === 'cin' && !this.selectedItem.cin) {
      this.cinValid = true; // CIN is optional
    } else if (field === 'nom' && !this.selectedItem.nom && !this.isEntreprise) {
      this.detailForm.form.get('nom')?.setErrors({ required: true });
    } else if (field === 'raisonSociale' && !this.selectedItem.raisonSociale && this.isEntreprise) {
      this.detailForm.form.get('raisonSociale')?.setErrors({ required: true });
    } else if (field === 'adresse' && !this.selectedItem.adresse) {
      this.detailForm.form.get('adresse')?.setErrors({ required: true });
    } else if (field === 'typeClient' && !this.selectedItem.typeClient.id) {
      this.detailForm.form.get('typeClient')?.setErrors({ required: true });
    } else if (field === 'email' && !this.selectedItem.email) {
      this.detailForm.form.get('email')?.setErrors({ required: true });
    }
  }


  addMouvementClient() {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(MouvementAddComponent, options);
    component.componentInstance.client = this.selectedItem;
    component.componentInstance.newItem.client = this.selectedItem;
  }
}