import {Component, Input, OnInit} from '@angular/core';
import {Facture} from "../../../../model/facture/facture";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {HistoFactureService} from "../../../../services/histo-facture/histo-facture.service";
import {HistoFacture} from "../../../../model/histo-facture/histo-facture";
import {ToastrService} from "ngx-toastr";

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
  ) { }

  ngOnInit(): void {
    this.loadData();
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
