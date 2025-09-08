import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MouvementInfra } from '../../../../model/mouvement-infra/mouvement-infra';
import { Infrastructure } from '../../../../model/infrastructure/infrastructure';
import { Frequence } from '../../../../model/frequence/frequence';
import { MouvementInfraService } from '../../../../services/mouvement-infra/mouvement-infra.service';
import { FrequenceService } from '../../../../services/frequence/frequence.service';
import { InfrastructureListPopupComponent } from '../../infrastructure-list-popup/infrastructure-list-popup.component';
import { DetailInfrastructureComponent } from '../../detail-infrastructure/detail-infrastructure.component';

@Component({
  selector: 'app-mouvement-infras-popup',
  templateUrl: './mouvement-infras-popup.component.html',
  styleUrls: ['./mouvement-infras-popup.component.scss']
})
export class MouvementInfrasPopupComponent implements OnInit {
  @Input() mouvementInfras: MouvementInfra[] = [];
  @Input() mouvementId: string = '';
  @Output() afterEmit = new EventEmitter();
  selectedInfraId: string = '';
  selectedNom: string = '';
  selectedNumero: string = '';
  isLoading: boolean = false;
  frequences: Frequence[] = [];
  defaultFrequence: Frequence = new Frequence();

  constructor(
      public activeModal: NgbActiveModal,
      private modalService: NgbModal,
      private toastr: ToastrService,
      private mouvementInfraService: MouvementInfraService,
      private frequenceService: FrequenceService
  ) {}

  ngOnInit() {
    if (!this.mouvementId) {
      this.toastr.error('ID du mouvement requis pour ajouter des infrastructures');
    }
    this.loadFrequences();
    this.loadFrequenceDefault();
  }

  loadFrequences() {
    this.isLoading = true;
    this.frequenceService.getAll().subscribe({
      next: (frequences) => {
        this.frequences = frequences;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading frequences:', error);
        this.toastr.error('Erreur lors du chargement des fréquences');
        this.isLoading = false;
      }
    });
  }

  loadFrequenceDefault() {
    this.frequenceService.findDefaultFrequence().subscribe({
      next: (data) => {
        this.defaultFrequence = { ...data };
        // Appliquer la fréquence par défaut aux infrastructures existantes si non définie
        this.mouvementInfras = this.mouvementInfras.map(mvt => ({
          ...mvt,
          frequence: mvt.frequence ? { ...mvt.frequence } : { ...this.defaultFrequence }
        }));
      },
      error: (err) => {
        console.error('Error loading default frequence:', err);
        this.toastr.error('Erreur lors du chargement de la fréquence par défaut');
      }
    });
  }

  openDeleteModal(modal: any, infraId: string, nom: string, numero: string) {
    this.selectedInfraId = infraId;
    this.selectedNom = nom || 'N/A';
    this.selectedNumero = numero || 'N/A';
    const options: NgbModalOptions = { centered: true, backdrop: 'static' };
    this.modalService.open(modal, options);
  }

  deleteInfrastructure(infraId: string) {
    this.mouvementInfraService.delete(infraId).subscribe({
      next: () => {
        this.mouvementInfras = this.mouvementInfras.filter(mvt => mvt.id !== infraId);
        this.toastr.success('Infrastructure supprimée avec succès');
        this.afterEmit.emit();
      },
      error: (error) => {
        console.error('Error deleting mouvementInfra:', error);
        this.toastr.error('Erreur lors de la suppression de l\'infrastructure');
      }
    });
  }

  openAddInfrastructureModal() {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const modal = this.modalService.open(InfrastructureListPopupComponent, options);
    modal.componentInstance.infrastructureNotInSelections = this.mouvementInfras.map(m => m.infrastructure);
    modal.componentInstance.infrastructureSelected.subscribe((infra: Infrastructure) => {
      this.addInfrastructure(infra);
      this.afterEmit.emit();
      modal.close();
    });
  }

  openDetailModal(id: string) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const modal = this.modalService.open(DetailInfrastructureComponent, options);
    modal.componentInstance.infrastructureId = id;
  }

  addInfrastructure(infra: Infrastructure) {
    if (!infra || !infra.id) {
      this.toastr.error('Infrastructure invalide ou sans ID');
      return;
    }
    const newMouvementInfra: MouvementInfra = new MouvementInfra();
    newMouvementInfra.infrastructure = infra;
    newMouvementInfra.mouvement.id = this.mouvementId;
    newMouvementInfra.frequence = { ...this.defaultFrequence };

    this.mouvementInfraService.create(newMouvementInfra).subscribe({
      next: (created) => {
        this.mouvementInfras = [...this.mouvementInfras, created];
        this.toastr.success('Infrastructure ajoutée avec succès');
      },
      error: (error) => {
        console.error('Error adding mouvementInfra:', error);
        this.toastr.error('Erreur lors de l\'ajout de l\'infrastructure');
      }
    });
  }

  onFrequenceChange(index: number) {
    // Mettre à jour la fréquence dans le backend si nécessaire
    const mouvementInfra = this.mouvementInfras[index];
    if (mouvementInfra.id) {
      this.mouvementInfraService.update(mouvementInfra.id, mouvementInfra).subscribe({
        next: (updated) => {
          this.mouvementInfras[index] = updated;
          this.toastr.success('Fréquence mise à jour avec succès');
        },
        error: (error) => {
          console.error('Error updating fréquence:', error);
          this.toastr.error('Erreur lors de la mise à jour de la fréquence');
        }
      });
    }
  }
}