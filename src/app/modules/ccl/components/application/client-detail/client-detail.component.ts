import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import {Client} from "../../../model/client/client";
import {TypeClient} from "../../../model/type-client/type-client";
import {ClientService} from "../../../services/client/client.service";
import {TypeClientService} from "../../../services/type-client/type-client.service";
import {MouvementAddComponent} from "../mouvement-add/mouvement-add.component";

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {
  @Input() clientId!: string;
  selectedItem: Client = new Client();
  totalPersonnes = 0;
  typeClients: TypeClient[] = [];
  isEditing = false;
  isLoading = true;
  isEntreprise: boolean = false;
  @Output() loadData = new EventEmitter<void>();

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
  }

  loadClient() {
    if (this.clientId) {
      this.service.getById(this.clientId).subscribe({
        next: (data) => {
          this.selectedItem = { ...data, typeClient: { ...data.typeClient }, etat: { ...data.etat } };
          this.onTypeClientChange();
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
      },

      error: (error) => {
        console.error('Error loading total personnes:', error);
        this.toastr.error("erreur lors du chargement du total des personnes invites par le client ");
      }
    })

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
    if (this.selectedItem) {
      this.service.getById(this.selectedItem.id).subscribe({
        next: (data) => {
          this.selectedItem = { ...data, typeClient: { ...data.typeClient }, etat: { ...data.etat } };
          this.onTypeClientChange();
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Error reloading client details:', error);
          this.toastr.error('Erreur lors du rechargement des détails');
        }
      });
    }
  }

  update(form: NgForm) {
    if (this.selectedItem && form.valid) {
      const updatedClient: Client = {
        ...this.selectedItem,
        typeClient: this.typeClients.find(type => type.id === this.selectedItem.typeClient.id) || new TypeClient(),
        nom: !this.isEntreprise ? this.selectedItem.nom : '',
        prenom: !this.isEntreprise ? this.selectedItem.prenom : '',
        raisonSociale: this.isEntreprise ? this.selectedItem.raisonSociale : '',
        cin: !this.isEntreprise ? this.selectedItem.cin : '',
        adresse: this.selectedItem.adresse,
        contacts: this.selectedItem.contacts,
        email: this.selectedItem.email,
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

  navigateToMovements(id: string) {
    this.modalService.dismissAll();
    this.router.navigate([`/general/mouvement/client/${id}`]);
  }
  addMouvementClient() {
    const options:NgbModalOptions = {size:'lg' , centered:true , backdrop:'static'};
    const component  = this.modalService.open(MouvementAddComponent , options) ;
    component.componentInstance.client=this.selectedItem;
    component.componentInstance.newItem.client = this.selectedItem;
  }

}