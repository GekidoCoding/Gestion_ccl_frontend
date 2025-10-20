import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Mouvement } from '../../../model/mouvement/mouvement';
import { Infrastructure } from '../../../model/infrastructure/infrastructure';
import { Client } from '../../../model/client/client';
import { TypeMouvement } from '../../../model/type-mouvement/type-mouvement';
import { MouvementInfra } from '../../../model/mouvement-infra/mouvement-infra';
import { MouvementService } from '../../../services/mouvement/mouvement.service';
import { ClientService } from '../../../services/client/client.service';
import { TypeMouvementService } from '../../../services/type-mouvement/type-mouvement.service';
import { InfrastructureService } from '../../../services/infrastructure/infrastructure.service';
import { MouvementInfraService } from '../../../services/mouvement-infra/mouvement-infra.service';
import { HistoriqueMvtPopupComponent } from '../../historique/historique-mvt-popup/historique-mvt-popup.component';
import { FactureAddComponent } from '../../facture/facture-add/facture-add.component';
import { FactureListPopupComponent } from '../../facture/facture-list-popup/facture-list-popup.component';
import { ConfigService } from '../../../services/config/config.service';
import { FrequenceService } from '../../../services/frequence/frequence.service';
import { Frequence } from '../../../model/frequence/frequence';
import { DetailInfrastructureComponent } from '../../infrastructure/detail-infrastructure/detail-infrastructure.component';
import { FactureService } from '../../../services/facture/facture.service';
import { YesNoWarningComponent } from '../../yes-no-warning/yes-no-warning.component';
import { MouvementVisualisationComponent } from '../mouvement-visualisation/mouvement-visualisation.component';
import {
  InfrastructureListPopupComponent
} from "../../infrastructure/infrastructure-list-popup/infrastructure-list-popup.component";
import {ClientListPopupComponent} from "../../client/client-list-popup/client-list-popup.component";

@Component({
  selector: 'app-mouvement-detail',
  templateUrl: './mouvement-detail.component.html',
  styleUrls: ['./mouvement-detail.component.scss']
})
export class MouvementDetailComponent implements OnInit {
  @Input() mouvementId!: string;
  @Output() afterAction = new EventEmitter<void>();
  @ViewChild('detailForm') detailForm!: NgForm;
  selectedItem: Mouvement = new Mouvement();
  typeMouvements: TypeMouvement[] = [];
  filteredTypeMouvements: TypeMouvement[] = [];
  clients: Client[] = [];
  isReservation: boolean = false;
  isLoading: boolean = true;
  isEditing: boolean = false;
  mouvementInfrasValid: boolean = true;
  clientValid: boolean = true;
  datesValid: boolean = true;
  capacityValid: boolean = true;
  totalCapacity: number = 0;
  frequences: Frequence[] = [];
  frequencesValid: boolean = true;
  defaultFrequence: Frequence = new Frequence();
  register: boolean = false;
  infrastructuresNotInSelections: Infrastructure[] = [];

  constructor(
      public activeModal: NgbActiveModal,
      public modalService: NgbModal,
      private mouvementService: MouvementService,
      private clientService: ClientService,
      private typeMouvementService: TypeMouvementService,
      private infrastructureService: InfrastructureService,
      private mouvementInfraService: MouvementInfraService,
      private frequenceService: FrequenceService,
      private factureService: FactureService,
      private toastr: ToastrService,
      private configService: ConfigService
  ) {
    this.selectedItem.mouvementInfras = [];
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadTypeMouvements();
    this.loadClients();
    this.loadMouvement();
    this.loadFrequences();
    this.loadFrequenceDefault();
  }

  loadFrequenceDefault() {
    this.frequenceService.findDefaultFrequence().subscribe({
      next: (data) => {
        this.defaultFrequence = { ...data };
      },
      error: (err) => {
        this.toastr.error('Erreur lors du chargement de la fréquence par défaut');
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

  loadMouvement() {
    if (this.mouvementId) {
      this.isLoading = true;
      this.mouvementService.getById(this.mouvementId).subscribe({
        next: (data) => {
          this.selectedItem = {
            ...data,
            client: { ...data.client },
            typeMouvement: { ...data.typeMouvement },
            mouvementInfras: data.mouvementInfras ? data.mouvementInfras.map((mi) => ({
              ...mi,
              infrastructure: { ...mi.infrastructure },
              mouvement: { ...mi.mouvement },
              frequence: mi.frequence ? { ...mi.frequence } : { ...this.defaultFrequence }
            })) : []
          };
          this.infrastructuresNotInSelections = this.selectedItem.mouvementInfras.map(mi => mi.infrastructure);
          this.onTypeMouvementChange();
          this.filterTypeMouvements();
          this.validateMouvementInfras();
          this.validateClient();
          this.validateDates();
          this.validateCapacity();
          this.validateFrequences();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading mouvement details:', error);
          this.toastr.error('Erreur lors du chargement des détails du mouvement');
          this.isLoading = false;
        }
      });
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
        this.filterTypeMouvements();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading type de mouvements:', error);
        this.toastr.error('Erreur lors du chargement des types de mouvements');
        this.isLoading = false;
      }
    });
  }

  filterTypeMouvements() {
    const currentNiveau = this.selectedItem?.typeMouvement?.niveauProcessus ?? null;
    if (currentNiveau != null) {
      this.filteredTypeMouvements = this.typeMouvements.filter(
          (type) =>
              (type.niveauProcessus == null && type.niveauProcessus !== currentNiveau) ||
              type.niveauProcessus >= currentNiveau
      );
    } else {
      this.filteredTypeMouvements = [...this.typeMouvements];
    }
  }

  onTypeMouvementChange() {
    const selectedType = this.typeMouvements.find((type) => type.id === this.selectedItem?.typeMouvement.id);
    this.isReservation = selectedType?.nom !== 'Renseignement';
    if (!this.isReservation && this.selectedItem) {
      this.selectedItem.periodeDebut = '';
      this.selectedItem.periodeFin = '';
      this.selectedItem.nombre = 0;
      this.datesValid = true;
      this.capacityValid = true;
    } else {
      this.validateDates();
      this.validateCapacity();
    }
    this.filterTypeMouvements();
  }

  handleInfrastructureSelected(infras: Infrastructure[]) {
    infras.forEach(infra => {
      if (!this.selectedItem.mouvementInfras.some(existing => existing.infrastructure.id === infra.id)) {
        const mi = new MouvementInfra();
        mi.infrastructure = infra;
        mi.mouvement.id = this.selectedItem.id;
        mi.frequence = { ...this.defaultFrequence };
        this.selectedItem.mouvementInfras.push(mi);
        this.infrastructuresNotInSelections.push(infra);
      }
    });
    this.validateMouvementInfras();
    this.validateCapacity();
    this.validateFrequences();
  }

  removeInfrastructure(index: number) {
    const infra = this.selectedItem.mouvementInfras[index].infrastructure;
    this.selectedItem.mouvementInfras = this.selectedItem.mouvementInfras.filter((_, i) => i !== index);
    this.infrastructuresNotInSelections = this.infrastructuresNotInSelections.filter(i => i.id !== infra.id);
    this.validateMouvementInfras();
    this.validateCapacity();
    this.validateFrequences();
  }

  openDetailModal(id: string) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const modal = this.modalService.open(DetailInfrastructureComponent, options);
    modal.componentInstance.infrastructureId = id;
  }

  handleClientSelected(client: Client) {
    if (this.selectedItem) {
      this.selectedItem.client = { ...client };
      this.validateClient();
    }
  }

  validateMouvementInfras() {
    this.mouvementInfrasValid = this.selectedItem.mouvementInfras.length > 0;
  }

  validateClient() {
    this.clientValid = !!this.selectedItem.client?.id;
  }

  onClickDownload() {
    const options = {};
    const composant = this.modalService.open(YesNoWarningComponent, options);
    composant.componentInstance.message = 'Voulez-vous sauvegarder ce proforma dans les statistiques ?';
    composant.componentInstance.confirm.subscribe({
      next: () => {
        this.register = true;
        this.onDownloadproforma();
        this.toastr.success('Proforma sauvegardée avec succès');
      }
    });
    composant.componentInstance.decline.subscribe({
      next: () => {
        this.onDownloadproforma();
      }
    });
  }

  onDownloadproforma() {
    this.factureService.downloadProforma(this.selectedItem.id, true).subscribe((file: Blob) => {
      const fileURL = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'proforma.pdf';
      link.click();
      window.URL.revokeObjectURL(fileURL);
    });
  }

  validateDates() {
    if (!this.isReservation) {
      this.datesValid = true;
      return;
    }
    if (!this.selectedItem.periodeDebut || !this.selectedItem.periodeFin) {
      this.datesValid = true;
      return;
    }
    const debut = new Date(this.selectedItem.periodeDebut);
    const fin = new Date(this.selectedItem.periodeFin);
    this.datesValid = debut <= fin;
  }

  validateCapacity() {
    if (!this.isReservation || this.selectedItem.nombre === null || this.selectedItem.nombre === undefined) {
      this.capacityValid = true;
      this.totalCapacity = 0;
      return;
    }

    this.totalCapacity = this.selectedItem.mouvementInfras.reduce((sum, mi) => {
      const capacite = mi.infrastructure.capacite ? Number(mi.infrastructure.capacite) : 0;
      return sum + (isNaN(capacite) ? 0 : capacite);
    }, 0);

    this.capacityValid = this.selectedItem.nombre <= this.totalCapacity;
  }

  validateFrequences() {
    this.frequencesValid = this.selectedItem.mouvementInfras.every((mi) => mi.frequence?.id);
  }

  onFrequenceChange() {
    this.validateFrequences();
  }

  trackByIndex(index: number): number {
    return index;
  }

  openPopup(content: any) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  toggleEditMode() {
    this.isEditing = true;
    this.filterTypeMouvements();
  }

  cancelEdit() {
    this.isLoading = true;
    this.mouvementService.getById(this.mouvementId).subscribe({
      next: (data) => {
        this.selectedItem = {
          ...data,
          client: { ...data.client },
          typeMouvement: { ...data.typeMouvement },
          mouvementInfras: data.mouvementInfras
              ? data.mouvementInfras.map((mi) => ({
                ...mi,
                infrastructure: { ...mi.infrastructure },
                mouvement: { ...mi.mouvement },
                frequence: mi.frequence ? { ...mi.frequence } : { ...this.defaultFrequence }
              }))
              : []
        };
        this.infrastructuresNotInSelections = this.selectedItem.mouvementInfras.map(mi => mi.infrastructure);
        this.isEditing = false;
        this.onTypeMouvementChange();
        this.filterTypeMouvements();
        this.validateMouvementInfras();
        this.validateClient();
        this.validateDates();
        this.validateCapacity();
        this.validateFrequences();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error reloading mouvement details:', error);
        this.toastr.error('Erreur lors du rechargement des détails');
        this.isLoading = false;
      }
    });
  }

  update() {
    if (this.selectedItem && this.mouvementId) {
      this.detailForm.control.markAllAsTouched();
      this.validateMouvementInfras();
      this.validateClient();
      this.validateDates();
      this.validateCapacity();
      this.validateFrequences();

      if (
          !this.detailForm.valid ||
          !this.mouvementInfrasValid ||
          !this.clientValid ||
          !this.datesValid ||
          !this.capacityValid ||
          !this.frequencesValid
      ) {
        this.isLoading = false;
        return;
      }

      this.isLoading = true;

      if (this.selectedItem.periodeDebut) {
        this.selectedItem.periodeDebut = this.selectedItem.periodeDebut + ':00';
      }
      if (this.selectedItem.periodeFin) {
        this.selectedItem.periodeFin = this.selectedItem.periodeFin + ':00';
      }
      if (this.selectedItem.dhMouvement) {
        this.selectedItem.dhMouvement = this.selectedItem.dhMouvement + ':00';
      }

      this.mouvementService.update(this.selectedItem.id, this.selectedItem).subscribe({
        next: (data) => {
          this.selectedItem = {
            ...data,
            client: { ...data.client },
            typeMouvement: { ...data.typeMouvement },
            mouvementInfras: data.mouvementInfras
                ? data.mouvementInfras.map((mi) => ({
                  ...mi,
                  infrastructure: { ...mi.infrastructure },
                  mouvement: { ...mi.mouvement },
                  frequence: mi.frequence ? { ...mi.frequence } : { ...this.defaultFrequence }
                }))
                : []
          };
          this.infrastructuresNotInSelections = this.selectedItem.mouvementInfras.map(mi => mi.infrastructure);
          this.isEditing = false;
          this.onTypeMouvementChange();
          this.filterTypeMouvements();
          this.validateMouvementInfras();
          this.validateClient();
          this.validateDates();
          this.validateCapacity();
          this.validateFrequences();
          this.loadMouvement();
          this.afterAction.emit();
          this.isLoading = false;
        },
        error: (error) => {
          console.log(JSON.stringify(error));
          const message = error.error?.message || 'Erreur inconnue';
          this.toastr.error(message);
          this.isLoading = false;
        }
      });
    }
  }

  classerMouvement(mouvementId: string) {
    this.isLoading = true;
    this.mouvementService.classerMouvement(mouvementId).subscribe({
      next: (data) => {
        this.selectedItem = {
          ...data,
          client: { ...data.client },
          typeMouvement: { ...data.typeMouvement },
          mouvementInfras: data.mouvementInfras
              ? data.mouvementInfras.map((mi) => ({
                ...mi,
                infrastructure: { ...mi.infrastructure },
                mouvement: { ...mi.mouvement },
                frequence: mi.frequence ? { ...mi.frequence } : { ...this.defaultFrequence }
              }))
              : []
        };
        this.infrastructuresNotInSelections = this.selectedItem.mouvementInfras.map(mi => mi.infrastructure);
        this.toastr.success('Mouvement classé avec succès');
        this.onTypeMouvementChange();
        this.filterTypeMouvements();
        this.validateMouvementInfras();
        this.validateClient();
        this.validateDates();
        this.validateCapacity();
        this.validateFrequences();
        this.afterAction.emit();
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erreur lors du classement de ce mouvement');
        this.isLoading = false;
      }
    });
  }

  accorderMouvement(mouvementId: string) {
    this.isLoading = true;
    this.mouvementService.accorderMouvement(mouvementId).subscribe({
      next: (data) => {
        this.selectedItem = {
          ...data,
          client: { ...data.client },
          typeMouvement: { ...data.typeMouvement },
          mouvementInfras: data.mouvementInfras
              ? data.mouvementInfras.map((mi) => ({
                ...mi,
                infrastructure: { ...mi.infrastructure },
                mouvement: { ...mi.mouvement },
                frequence: mi.frequence ? { ...mi.frequence } : { ...this.defaultFrequence }
              }))
              : []
        };
        this.infrastructuresNotInSelections = this.selectedItem.mouvementInfras.map(mi => mi.infrastructure);
        this.toastr.success('Mouvement accordé avec succès');
        this.onTypeMouvementChange();
        this.filterTypeMouvements();
        this.validateMouvementInfras();
        this.validateClient();
        this.validateDates();
        this.validateCapacity();
        this.validateFrequences();
        this.afterAction.emit();
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error("Erreur : On ne peut qu'accorder les réservations");
        this.isLoading = false;
      }
    });
  }

  toggleAddFacture() {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(FactureAddComponent, options);
    component.componentInstance.mouvementSelected = this.selectedItem;
    component.componentInstance.afterAction.subscribe(() => this.afterAction.emit());
  }

  toggleListFacture() {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(FactureListPopupComponent, options);
    component.componentInstance.mouvement = this.selectedItem;
  }

  openHistoriquePopup(mouvementId: string) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const modal = this.modalService.open(HistoriqueMvtPopupComponent, options);
    modal.componentInstance.mouvementId = mouvementId;
  }

  openVisualisation() {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const composant = this.modalService.open(MouvementVisualisationComponent, options);
    composant.componentInstance.mouvementId = this.mouvementId;
  }
  openInfraListPopup(){
    const options:NgbModalOptions= {size: 'lg', centered: true };
    let composant=this.modalService.open(InfrastructureListPopupComponent,options);
    composant.componentInstance.infrastructureNotInSelections=this.infrastructuresNotInSelections;
    composant.componentInstance.infrastructureSelectedChange.subscribe({
      next: (data: Infrastructure[]) => {
        this.handleInfrastructureSelected(data );
      }
    })
  }
  openClientListPopup(){
    const options:NgbModalOptions= {size: 'lg', centered: true };
    let composant=this.modalService.open(ClientListPopupComponent,options);
    composant.componentInstance.clientSelected=this.selectedItem.client;
    composant.componentInstance.clientSelectedChange.subscribe({
      next: (data: Client) => {
        this.handleClientSelected(data);
      }
    })
  }
}