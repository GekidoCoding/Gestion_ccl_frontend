import {Component, Input, OnInit} from '@angular/core';
import {Facture} from "../../../../model/facture/facture";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HistoFactureService} from "../../../../services/histo-facture/histo-facture.service";
import {HistoFacture} from "../../../../model/histo-facture/histo-facture";
import {ToastrService} from "ngx-toastr";
import {Mouvement} from "../../../../model/mouvement/mouvement";
import {
  MouvementInfrasPopupComponent
} from "../../mouvement-infras-popup/mouvement-infras-popup/mouvement-infras-popup.component";

@Component({
  selector: 'app-histo-facture-list-popup',
  templateUrl: './histo-facture-list-popup.component.html',
  styleUrls: ['./histo-facture-list-popup.component.scss']
})
export class HistoFactureListPopupComponent implements OnInit {
  @Input() public selected:Facture=new Facture();
  items: HistoFacture[] = [];
  constructor(
      public activeModal: NgbActiveModal,
      private service: HistoFactureService,
      private toastr: ToastrService,
      private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  openInfrasPopup(mouvement: Mouvement) {
    const modal = this.modalService.open(MouvementInfrasPopupComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modal.componentInstance.mouvementInfras = mouvement.mouvementInfras || [];
    modal.componentInstance.mouvementId = mouvement.id;
  }
  loadData(){
    this.service.getByFacture(this.selected.id).subscribe({
      next: data => {
        this.items=data;
        console.log("histo factures:"+ JSON.stringify(data));
      },
      error: error => {
        console.log(error);
        this.toastr.error("Erreur lors du chargement des historiques de la facture");
      }
    })
  }


}
