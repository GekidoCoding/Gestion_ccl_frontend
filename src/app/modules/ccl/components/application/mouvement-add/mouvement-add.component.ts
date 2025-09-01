import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Infrastructure } from '../../../model/infrastructure/infrastructure';
import { TypeMouvement } from '../../../model/type-mouvement/type-mouvement';
import { Client } from '../../../model/client/client';
import { Mouvement } from '../../../model/mouvement/mouvement';
import { ClientService } from '../../../services/client/client.service';
import { TypeMouvementService } from '../../../services/type-mouvement/type-mouvement.service';
import { MouvementService } from '../../../services/mouvement/mouvement.service';
import { Facture } from '../../../model/facture/facture';
import { FactureAddComponent } from '../facture/facture-add/facture-add.component';
import { InfrastructureService } from '../../../services/infrastructure/infrastructure.service';
import {MouvementInfra} from "../../../model/mouvement-infra/mouvement-infra";

@Component({
  selector: 'app-mouvement-add',
  templateUrl: './mouvement-add.component.html',
  styleUrls: ['./mouvement-add.component.scss']
})
export class MouvementAddComponent implements OnInit {
  @Input() infrastructure: Infrastructure = new Infrastructure();
  @Input() client: Client = new Client();
  @Output() afterAdd = new EventEmitter<void>();

  typeMouvements: TypeMouvement[] = [];
  clients: Client[] = [];
  newItem: Mouvement = new Mouvement();
  isReservation: boolean = false;
  filteredTypeMouvements: TypeMouvement[] = [];
  facture: Facture = new Facture();
  isLoading = false;

  constructor(
      public activeModal: NgbActiveModal,
      private modalService: NgbModal,
      private toastr: ToastrService,
      private clientService: ClientService,
      private typeMouvementService: TypeMouvementService,
      private service: MouvementService,
      private infrastructureService: InfrastructureService
  ) {
    // Initialize mouvementInfras as an empty array
    this.newItem.mouvementInfras = [];
  }

  ngOnInit() {
    this.loadClients();
    this.loadTypeMouvements();
    if (this.client.id) {
      this.newItem.client = this.client;
    }
    if (this.infrastructure.id) {
      const mi = new MouvementInfra();
      mi.infrastructure = this.infrastructure;
      mi.mouvement = new Mouvement();
      this.newItem.mouvementInfras = [mi];
    }

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

  loadTypeMouvements() {
    this.isLoading = true;
    this.typeMouvementService.getAll().subscribe({
      next: (objs) => {
        this.typeMouvements = objs;
        this.filteredTypeMouvements = objs;
        if (this.filteredTypeMouvements.length > 0) {
          this.newItem.typeMouvement.id = this.filteredTypeMouvements[0].id;
          this.onTypeMouvementChange();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading type de mouvements:', error);
        this.toastr.error('Erreur lors du chargement des type de mouvements');
        this.isLoading = false;
      }
    });
  }

  onTypeMouvementChange() {
    const selectedType = this.typeMouvements.find(type => type.id === this.newItem.typeMouvement.id);
    this.isReservation = selectedType?.nom !== 'Renseignement';
    if (!this.isReservation) {
      this.newItem.periodeDebut = '';
      this.newItem.periodeFin = '';
      this.newItem.nombre = 0;
    }
  }

  handleInfrastructureSelected(infra: Infrastructure, content: any) {
    if (!this.newItem.mouvementInfras.some(existing => existing.infrastructure.id === infra.id)) {
      const mi = new MouvementInfra();
      mi.infrastructure = infra;
      mi.mouvement = new Mouvement();
      this.newItem.mouvementInfras.push(mi);
      // this.toastr.success('Infrastructure ajoutée avec succès !');
    } else {
      this.toastr.warning('Cette infrastructure est déjà sélectionnée.');
    }
    content.dismiss('Cross Click');
  }


  removeInfrastructure(index: number) {
    this.newItem.mouvementInfras = this.newItem.mouvementInfras.filter((_, i) => i !== index);
  }

  allActions() {
    this.isLoading = true;

    const selectedTypeMouvement = this.typeMouvements.find(
        type => type.id === this.newItem.typeMouvement.id
    );

    if (!selectedTypeMouvement) {
      this.toastr.error('Type de mouvement invalide.');
      this.isLoading = false;
      return;
    }

    if (!this.newItem.mouvementInfras || this.newItem.mouvementInfras.length === 0) {
      this.toastr.error('Veuillez sélectionner au moins une infrastructure.');
      this.isLoading = false;
      return;
    }

    this.newItem.typeMouvement = selectedTypeMouvement;

    if (this.newItem.periodeDebut) {
      this.newItem.periodeDebut = this.newItem.periodeDebut + ':00';
    }
    if (this.newItem.periodeFin) {
      this.newItem.periodeFin = this.newItem.periodeFin + ':00';
    }
    if (this.newItem.dhMouvement) {
      this.newItem.dhMouvement = this.newItem.dhMouvement + ':00';
    }

    this.service.create(this.newItem).subscribe({
      next: (created: Mouvement) => {
        if (created.typeMouvement.id == 'TPM-00000002') {
          this.openFacture(created);
        }
        this.toastr.success('Mouvement ajouté avec succès !');
        this.activeModal.close();
        this.afterAdd.emit();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Erreur lors de l\'ajout du mouvement.');
        this.isLoading = false;
      }
    });
  }


  handleClientSelected(client: Client, content: any) {
    this.newItem.client = { ...client };
    content.dismiss('Cross Click');
  }

  openPopup(content: any) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }
  get infrastructuresNotInSelections(): Infrastructure[] {
    return (this.newItem.mouvementInfras || []).map(m => m.infrastructure);
  }


  openFacture(mouvement: Mouvement) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(FactureAddComponent, options);
    component.componentInstance.mouvementSelected = mouvement;
    component.componentInstance.title = 'Voulez-vous enregistrer cette facture proforma pour cette réservation ?';
    component.componentInstance.afterAction.subscribe(() => this.afterAdd.emit());
  }
}