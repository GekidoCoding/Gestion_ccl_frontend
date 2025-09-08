import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
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
import { MouvementInfra } from '../../../model/mouvement-infra/mouvement-infra';
import { FrequenceService } from '../../../services/frequence/frequence.service';
import { Frequence } from '../../../model/frequence/frequence';
import {DetailInfrastructureComponent} from "../detail-infrastructure/detail-infrastructure.component";
import {WarningPopupComponent} from "../warning-popup/warning-popup.component";
import {ComponentUtil} from "../../../util/component-util";
@Component({
  selector: 'app-mouvement-add',
  templateUrl: './mouvement-add.component.html',
  styleUrls: ['./mouvement-add.component.scss']
})
export class MouvementAddComponent implements OnInit {
  @Input() infrastructure: Infrastructure = new Infrastructure();
  @Input() client: Client = new Client();
  @Output() afterAdd = new EventEmitter<void>();
  @ViewChild('mouvementForm') mouvementForm!: NgForm;
  @Input( ) newItem: Mouvement = new Mouvement();
  public componentUtil:ComponentUtil = new ComponentUtil();
  typeMouvements: TypeMouvement[] = [];
  clients: Client[] = [];
  isReservation: boolean = true;
  filteredTypeMouvements: TypeMouvement[] = [];
  facture: Facture = new Facture();
  isLoading = false;
  mouvementInfrasValid: boolean = true;
  clientValid: boolean = true;
  datesValid: boolean = true;
  capacityValid: boolean = true;
  totalCapacity: number = 0;
  frequences: Frequence[] = [];
  defaultFrequence: Frequence = new Frequence();
  frequencesValid: boolean = true;

  constructor(
      public activeModal: NgbActiveModal,
      private modalService: NgbModal,
      private toastr: ToastrService,
      private clientService: ClientService,
      private typeMouvementService: TypeMouvementService,
      private service: MouvementService,
      private infrastructureService: InfrastructureService,
      private frequenceService: FrequenceService
  ) {
    this.newItem.mouvementInfras = [];
  }

  ngOnInit() {
    this.loadClients();
    this.loadTypeMouvements();
    this.loadFrequences();
    this.loadFrequenceDefault();
    if (this.client.id) {
      this.newItem.client = this.client;
      this.clientValid = true;
    }
    if (this.infrastructure.id) {
      const mi = new MouvementInfra();
      mi.infrastructure = this.infrastructure;
      mi.mouvement = new Mouvement();
      mi.frequence = { ...this.defaultFrequence }; // Create a new instance
      this.newItem.mouvementInfras = [mi];
      this.mouvementInfrasValid = true;
      this.validateCapacity();
      this.validateFrequences();
    }
  }

  loadFrequenceDefault() {
    this.frequenceService.findDefaultFrequence().subscribe({
      next: data => {
        this.defaultFrequence = data;
      },
      error: err => {
        this.toastr.error("Erreur lors du chargement de la fréquence par défaut");
      }
    });
  }

  loadFrequences() {
    this.frequenceService.getAll().subscribe({
      next: (frequences) => {
        this.frequences = frequences;
      },
      error: (error) => {
        console.error('Error loading frequences:', error);
        this.toastr.error('Erreur lors du chargement des fréquences');
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

  loadTypeMouvements() {
    this.isLoading = true;
    this.typeMouvementService.getTrierAdding().subscribe({
      next: (objs) => {
        this.typeMouvements = objs;
        this.filteredTypeMouvements = objs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading type de mouvements:', error);
        this.toastr.error('Erreur lors du chargement des types de mouvements');
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
      this.datesValid = true;
      this.capacityValid = true;
    } else {
      this.validateDates();
      this.validateCapacity();
    }
  }

  handleInfrastructureSelected(infra: Infrastructure, content: any) {
    if (!this.newItem.mouvementInfras.some(existing => existing.infrastructure.id === infra.id)) {
      const mi = new MouvementInfra();
      mi.infrastructure = infra;
      mi.mouvement = new Mouvement();
      mi.frequence = { ...this.defaultFrequence }; // Create a new instance
      this.newItem.mouvementInfras.push(mi);
      this.mouvementInfrasValid = true;
    }
    content.dismiss('Cross Click');
    this.validateMouvementInfras();
    this.validateCapacity();
    this.validateFrequences();
  }

  removeInfrastructure(index: number) {
    this.newItem.mouvementInfras = this.newItem.mouvementInfras.filter((_, i) => i !== index);
    this.validateMouvementInfras();
    this.validateCapacity();
    this.validateFrequences();
  }
  openDetailModal(id:string){
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const modal = this.modalService.open(DetailInfrastructureComponent, options);
    modal.componentInstance.infrastructureId = id;
  }
  handleClientSelected(client: Client, content: any) {
    this.newItem.client = { ...client };
    this.clientValid = !!client.id;
    content.dismiss('Cross Click');
    this.validateClient();
  }

  validateMouvementInfras() {
    this.mouvementInfrasValid = this.newItem.mouvementInfras.length > 0;
  }

  validateClient() {
    this.clientValid = !!this.newItem.client?.id;
  }

  validateDates() {
    if (!this.isReservation) {
      this.datesValid = true;
      return;
    }
    if (!this.newItem.periodeDebut || !this.newItem.periodeFin) {
      this.datesValid = true; // Will be caught by required validation
      return;
    }
    const debut = new Date(this.newItem.periodeDebut);
    const fin = new Date(this.newItem.periodeFin);
    this.datesValid = debut <= fin;
  }

  validateCapacity() {
    if (!this.isReservation || this.newItem.nombre === null || this.newItem.nombre === undefined) {
      this.capacityValid = true;
      this.totalCapacity = 0;
      return;
    }

    this.totalCapacity = this.newItem.mouvementInfras.reduce((sum, mi) => {
      const capacite = mi.infrastructure.capacite ? Number(mi.infrastructure.capacite) : 0;
      return sum + (isNaN(capacite) ? 0 : capacite);
    }, 0);

    this.capacityValid = this.newItem.nombre <= this.totalCapacity;
  }

  validateFrequences() {
    this.frequencesValid = this.newItem.mouvementInfras.every(mi => mi.frequence?.id);
  }

  onFrequenceChange() {
    this.validateFrequences();
  }


  openWarningPopup(message: string) {
    const options: NgbModalOptions = {
      centered: true,
      backdrop: 'static',
      animation: true
    };

    const modalRef = this.modalService.open(WarningPopupComponent, options);
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.confirm.subscribe({
      next: () => {
        this.create();
      }
    });

  }

  allActions() {
    this.mouvementForm.control.markAllAsTouched();
    this.validateMouvementInfras();
    this.validateClient();
    this.validateDates();
    this.validateFrequences();

    if (!this.mouvementForm.valid || !this.mouvementInfrasValid || !this.clientValid || !this.datesValid || !this.frequencesValid) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    const selectedTypeMouvement = this.typeMouvements.find(
        type => type.id === this.newItem.typeMouvement.id
    );

    if (!selectedTypeMouvement) {
      this.toastr.error('Type de mouvement invalide.');
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
    this.service.getConflictMouvement(this.newItem).subscribe({
      next: result => {
        if (result && result.length > 0) {
          const message = `Des conflits ont été détectés avec les mouvements suivants :\n${result
              .map((conflict: Mouvement) =>
                  `- ${conflict.typeMouvement?.nom || 'N/A'} du ${conflict.periodeDebut || 'N/A'} au ${conflict.periodeFin || 'N/A'} de ${this.componentUtil.getClientName(conflict.client)} `
              )
              .join('\n')}\nVoulez-vous continuer ?`;

          // console.log("don't insert conflict");
          this.openWarningPopup(message);
          this.isLoading = false;
        } else {
          this.create();
        }
      },
      error: (error) => {
        console.error('Error checking conflicts:', error);
        this.toastr.error('Erreur lors de la vérification des conflits.');
        this.isLoading = false;
      }
    });

  }
  create(){
    this.service.create(this.newItem).subscribe({
      next: (created: Mouvement) => {
        if (created.typeMouvement.nom === 'Réservation') {
          this.openFacture(created);
        }
        this.toastr.success('Mouvement ajouté avec succès !');
        this.activeModal.close();
        this.afterAdd.emit();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error("Erreur lors de l'ajout du mouvement.");
        this.isLoading = false;
      }
    });
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