import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MouvementInfra } from '../../../../model/mouvement-infra/mouvement-infra';
import { Infrastructure } from '../../../../model/infrastructure/infrastructure';
import { MouvementInfraService } from '../../../../services/mouvement-infra/mouvement-infra.service';
import { InfrastructureListPopupComponent } from '../../infrastructure-list-popup/infrastructure-list-popup.component';

@Component({
  selector: 'app-mouvement-infras-popup',
  templateUrl: './mouvement-infras-popup.component.html',
  styleUrls: ['./mouvement-infras-popup.component.scss']
})
export class MouvementInfrasPopupComponent implements OnInit {
  @Input() mouvementInfras: MouvementInfra[] = [];
  @Input() mouvementId: string = '';
  @Output() afterEmit = new EventEmitter();
  showConfirmation: boolean = false;
  selectedInfraId: string | null = null;
  isLoading: boolean = false;

  constructor(
      public activeModal: NgbActiveModal,
      private modalService: NgbModal,
      private toastr: ToastrService,
      private mouvementInfraService: MouvementInfraService
  ) {}

  ngOnInit() {
    if (!this.mouvementId) {
      this.toastr.error('ID du mouvement requis pour ajouter des infrastructures');
    }
  }

  confirmDelete(infraId: string) {
    this.selectedInfraId = infraId;
    this.showConfirmation = true;
  }

  cancelDelete() {
    this.selectedInfraId = null;
    this.showConfirmation = false;
  }

  deleteInfrastructure() {
    if (this.selectedInfraId) {
      this.mouvementInfraService.delete(this.selectedInfraId).subscribe({
        next: () => {
          this.mouvementInfras = this.mouvementInfras.filter(mvt => mvt.id !== this.selectedInfraId);
          this.toastr.success('Infrastructure supprimée avec succès');
          this.afterEmit.emit();
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Error deleting mouvementInfra:', error);
          this.toastr.error('Erreur lors de la suppression de l\'infrastructure');
          this.cancelDelete();
        }
      });
    }
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

  addInfrastructure(infra: Infrastructure) {

    const newMouvementInfra:MouvementInfra = new MouvementInfra();
    newMouvementInfra.infrastructure = infra;
    newMouvementInfra.mouvement.id = this.mouvementId;

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
}