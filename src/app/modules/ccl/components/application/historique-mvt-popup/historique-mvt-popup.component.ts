import { Component, Input, OnInit } from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {HistoriqueMvt} from "../../../model/historique-mvt/historique-mvt";
import {HistoriqueMvtService} from "../../../services/historique-mvt/historique-mvt.service";
import {MouvementService} from "../../../services/mouvement/mouvement.service";
import {Mouvement} from "../../../model/mouvement/mouvement";
import {ComponentUtil} from "../../../util/component-util";
import {
  MouvementInfrasPopupComponent
} from "../mouvement-infras-popup/mouvement-infras-popup/mouvement-infras-popup.component";


@Component({
  selector: 'app-historique-mvt-popup',
  templateUrl: './historique-mvt-popup.component.html',
  styleUrls: ['./historique-mvt-popup.component.scss']
})
export class HistoriqueMvtPopupComponent implements OnInit {
  @Input() mouvementId!: string;
  componentUtil:ComponentUtil = new ComponentUtil();
  historiqueMvt: HistoriqueMvt[] = [];
  selectedMouvement!: Mouvement;
  isLoading = true;

  constructor(
      public activeModal: NgbActiveModal,
      private historiqueMvtService: HistoriqueMvtService,
      private mouvementService: MouvementService,
      private toastr: ToastrService ,
      public modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.loadHistoriqueMvt();
    this.loadMouvementDetails();
  }

  loadHistoriqueMvt() {
    this.historiqueMvtService.getByIdMvt(this.mouvementId).subscribe({
      next: (data) => {
        this.historiqueMvt = data;
        console.log(JSON.stringify( this.historiqueMvt));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading historique mouvement:', error);
        this.toastr.error('Erreur lors du chargement de l\'historique');
        this.isLoading = false;
      }
    });
  }

  loadMouvementDetails() {
    this.mouvementService.getById(this.mouvementId).subscribe({
      next: (data) => {
        this.selectedMouvement = data;
      },
      error: (error) => {
        console.error('Error loading historique mouvement:', error);
        this.toastr.error('Error lors du chargements des mouvements');
      }
    })
  }

  openInfrasPopup(mouvement: Mouvement) {
    const modal = this.modalService.open(MouvementInfrasPopupComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modal.componentInstance.mouvementInfras = mouvement.mouvementInfras || [];
    modal.componentInstance.mouvementId = mouvement.id;
  }

}