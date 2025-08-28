import {Component, Input, OnInit} from '@angular/core';
import {Mouvement} from "../../../../model/mouvement/mouvement";
import {NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Facture} from "../../../../model/facture/facture";
import {FactureService} from "../../../../services/facture/facture.service";
import {FactureAddComponent} from "../facture-add/facture-add.component";
import {ComponentUtil} from "../../../../util/component-util";
import {FactureDetailComponent} from "../facture-detail/facture-detail.component";

@Component({
  selector: 'app-facture-list-popup',
  templateUrl: './facture-list-popup.component.html',
  styleUrls: ['./facture-list-popup.component.scss']
})
export class FactureListPopupComponent implements OnInit {
  @Input()  mouvement:Mouvement=new Mouvement();
  items: Facture[] = [];
  componentUtil:ComponentUtil = new ComponentUtil();
  constructor(
      public activeModal: NgbActiveModal,
      private factureService: FactureService,
      private modalService: NgbModal,
      ) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(){
    if(this.mouvement.id){
      this.factureService.getByMouvementId(this.mouvement.id).subscribe({
        next: (factures)=>{
            this.items = factures;
        }
      })
    }
  }
  openAddFacture() {
    const options:NgbModalOptions= {size:'lg' , centered:true};
    const component = this.modalService.open(FactureAddComponent , options);
    component.componentInstance.mouvementSelected = this.mouvement;
    component.componentInstance.afterAction.subscribe(() => this.loadData());
  }
  openDetailFacture(item:Facture){
    const options:NgbModalOptions= {size:'lg' , centered:true};
    const component = this.modalService.open(FactureDetailComponent , options);
    component.componentInstance.selectedItem = item;
    component.componentInstance.afterAction.subscribe(() => this.loadData());

  }


}
