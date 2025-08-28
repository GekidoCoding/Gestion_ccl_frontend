import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Mouvement } from '../../../model/mouvement/mouvement';
import { Infrastructure } from '../../../model/infrastructure/infrastructure';
import { Client } from '../../../model/client/client';
import { TypeMouvement } from '../../../model/type-mouvement/type-mouvement';
import { MouvementService } from '../../../services/mouvement/mouvement.service';
import { ClientService } from '../../../services/client/client.service';
import { TypeMouvementService } from '../../../services/type-mouvement/type-mouvement.service';
import {InfrastructureService} from "../../../services/infrastructure/infrastructure.service";
import {HistoriqueMvtPopupComponent} from "../historique-mvt-popup/historique-mvt-popup.component";
import {FactureAddComponent} from "../facture/facture-add/facture-add.component";
import {FactureListPopupComponent} from "../facture/facture-list-popup/facture-list-popup.component";
import {HttpErrorResponse} from "@angular/common/http";
import {ConfigService} from "../../../services/config/config.service";

@Component({
  selector: 'app-mouvement-detail',
  templateUrl: './mouvement-detail.component.html',
  styleUrls: ['./mouvement-detail.component.scss']
})
export class MouvementDetailComponent implements OnInit {
  @Input() mouvementId!: string;
  @Output() afterAction = new EventEmitter<void>();
  selectedItem: Mouvement =new Mouvement();


  typeMouvements: TypeMouvement[] = [];
  filteredTypeMouvements: TypeMouvement[] = [];
  clients: Client[] = [];
  isReservation: boolean = false;
  isLoading: boolean = true;
  isEditing: boolean = false;

  constructor(
      public activeModal: NgbActiveModal,
      public modalService: NgbModal,
      private mouvementService: MouvementService,
      private clientService: ClientService,
      private typeMouvementService: TypeMouvementService,
      private infrastrcutureService:InfrastructureService,
      private toastr: ToastrService ,
      private configService: ConfigService,
  ) {}

  ngOnInit() {
   this.loadData();
  }
  loadData(){
    this.loadTypeMouvements();
    this.loadClients();
    this.loadMouvement();
  }
  loadMouvement() {
    if (this.mouvementId) {
      this.mouvementService.getById(this.mouvementId).subscribe({
        next: (data) => {
          this.selectedItem = { ...data, infrastructure: { ...data.infrastructure }, client: { ...data.client }, typeMouvement: { ...data.typeMouvement } };
          this.onTypeMouvementChange();
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
    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.toastr.error('Erreur lors du chargement des clients');
      }
    });
  }

  loadTypeMouvements() {
    this.typeMouvementService.getAll().subscribe({
      next: (objs) => {
        this.typeMouvements = objs;
        this.filteredTypeMouvements = objs;
      },
      error: (error) => {
        console.error('Error loading type de mouvements:', error);
        this.toastr.error('Erreur lors du chargement des types de mouvements');
      }
    });
  }

  onTypeMouvementChange() {
    const selectedType = this.typeMouvements.find(type => type.id === this.selectedItem?.typeMouvement.id);
    this.isReservation = selectedType?.nom != 'Renseignement';
    if (!this.isReservation && this.selectedItem) {
      this.selectedItem.periodeDebut = '';
      this.selectedItem.periodeFin = '';
      this.selectedItem.nombre = 0;
    }
  }

  openHistoriquePopup(mouvementId: string) {
    const modal = this.modalService.open(HistoriqueMvtPopupComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modal.componentInstance.mouvementId = mouvementId;
  }
  openPopup(content: any) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  handleClientSelected(client: Client, content: any) {
    if (this.selectedItem) {
      this.selectedItem.client = client;
      content.dismiss('Cross Click');
    }
  }

  handleInfrastructureSelected(infrastructure:Infrastructure, content: any) {
    if (this.selectedItem) {
        this.selectedItem.infrastructure = infrastructure;
      content.dismiss('Cross Click');
    }
  }

  toggleEditMode() {
    this.isEditing = true;
  }


  toggleAddFacture() {
    const options :NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(FactureAddComponent , options);
    component.componentInstance.mouvementSelected = this.selectedItem;
  }
  toggleListFacture() {
    const options :NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(FactureListPopupComponent , options);
    component.componentInstance.mouvement = this.selectedItem;
  }

  cancelEdit() {
    if (this.selectedItem) {
      this.mouvementService.getById(this.mouvementId).subscribe({
        next: (data) => {
          this.selectedItem = { ...data, infrastructure: { ...data.infrastructure }, client: { ...data.client }, typeMouvement: { ...data.typeMouvement } };
          this.isEditing = false;
          this.onTypeMouvementChange();
        },
        error: (error) => {
          console.error('Error reloading mouvement details:', error);
          this.toastr.error('Erreur lors du rechargement des détails');
        }
      });
    }
  }

  update() {
    if (this.selectedItem && this.mouvementId) {
      console.log(JSON.stringify(this.selectedItem));
      if (this.selectedItem.periodeDebut != null && this.selectedItem.periodeDebut!='') {
        this.selectedItem.periodeDebut = this.selectedItem.periodeDebut + ":00";
      }

      if (this.selectedItem.periodeFin != null && this.selectedItem.periodeFin!='') {
        this.selectedItem.periodeFin = this.selectedItem.periodeFin + ":00";
      }
      if (this.selectedItem.dhMouvement != null && this.selectedItem.dhMouvement!='') {
        this.selectedItem.dhMouvement = this.selectedItem.dhMouvement + ":00";
      }
      this.mouvementService.update(this.mouvementId, this.selectedItem).subscribe({
        next: () => {
          this.isEditing = false;
          this.toastr.success('Mouvement mis à jour avec succès !');
          this.loadMouvement();
          this.afterAction.emit();
        },
        error: (error) => {
          console.error('Error updating mouvement:', error);
          this.toastr.error('Erreur lors de la mise à jour du mouvement');
        }
      });
    }
  }
  classerMouvement(mouvementId:string ){
    this.mouvementService.classerMouvement(mouvementId).subscribe({
      next: (data) => {
        this.selectedItem=data;
        this.toastr.success("Mouvement classé avec succès");
        this.loadMouvement();
        this.afterAction.emit();
      },
      error: () => {
        this.toastr.error("Erreur lors du classement de ce mouvement");
      }
    });
  }
  accorderMouvement(mouvementId:string){
    this.mouvementService.accorderMouvement(mouvementId).subscribe({
      next: (data) => {
        this.selectedItem=data;
        this.toastr.success("Mouvement accordé avec succès");
        this.loadMouvement();
        this.afterAction.emit();
      },
      error: (error) => {
        this.toastr.error("Error:On ne peut qu'accorder les réservations ");
      }
    });
  }

}