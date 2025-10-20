import {Component, Input, OnInit} from '@angular/core';
import {Mouvement} from "../../../model/mouvement/mouvement";
import {NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Facture} from "../../../model/facture/facture";
import {FactureService} from "../../../services/facture/facture.service";
import {FactureAddComponent} from "../facture-add/facture-add.component";
import {ComponentUtil} from "../../../util/component-util";
import {FactureDetailComponent} from "../facture-detail/facture-detail.component";
import {
  MouvementInfrasPopupComponent
} from "../../mouvement/mouvement-infras-popup/mouvement-infras-popup.component";
import {PaiementPopupComponent} from "../../paiement/paiement-popup/paiement-popup.component";
import {ConfigService} from "../../../services/config/config.service";
import {SendEmailFactureComponent} from "../../send-email-facture/send-email-facture.component";
import {ToastrService} from "ngx-toastr";
import {YesNoWarningComponent} from "../../yes-no-warning/yes-no-warning.component";

@Component({
  selector: 'app-facture-list-popup',
  templateUrl: './facture-list-popup.component.html',
  styleUrls: ['./facture-list-popup.component.scss']
})
export class FactureListPopupComponent implements OnInit {
  @Input()  mouvement:Mouvement=new Mouvement();
  items: Facture[] = [];
  codeReelle:number=-1;
  codePayee:number=-1;
  componentUtil:ComponentUtil = new ComponentUtil();
  constructor(
      public activeModal: NgbActiveModal,
      private factureService: FactureService,
      private modalService: NgbModal,
      private configService: ConfigService,
      private toastService:ToastrService
      ) { }

  ngOnInit(): void {
    this.loadData();
    this.loadCodeReelle();
    this.loadCodePayee();
  }
  loadCodeReelle(){
    this.configService.getEtatCodeReelle().subscribe({
      next: data => {
        this.codeReelle=data;
      }
    })
  }
  loadCodePayee(){
    this.configService.getEtatCodePayee().subscribe({
      next: data => {
        this.codePayee=data;
      }
    })
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

  openInfrasPopup(mouvement: Mouvement) {
    const modal = this.modalService.open(MouvementInfrasPopupComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modal.componentInstance.mouvementInfras = mouvement.mouvementInfras || [];
    modal.componentInstance.mouvementId = mouvement.id;
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

  openListePaiement(item:Facture){
    const options:NgbModalOptions= {size:'lg' , centered:true};
    const component = this.modalService.open(PaiementPopupComponent , options);
    component.componentInstance.idFacture=item.id;

  }


  export(id:string ,  contrat:boolean) {
    if(contrat){
      this.factureService.downloadProformaExist(id)
          .subscribe((file: Blob) => {
            const fileURL = window.URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = 'proforma.pdf';
            link.click();
            window.URL.revokeObjectURL(fileURL);
          });
    }
    else{
      this.factureService.downloadContrat(id)
          .subscribe((file: Blob) => {
            const fileURL = window.URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = 'contrat.pdf';
            link.click();
            window.URL.revokeObjectURL(fileURL);
          });
    }

  }
  openSendEmailFacture(idFacture : String ,  isContrat:boolean) {
    const options:NgbModalOptions= {size:'lg' , centered:true};
    let composant = this.modalService.open(SendEmailFactureComponent , options);
    composant.componentInstance.id=idFacture;
    if(isContrat){
      composant.componentInstance.mode='proforma';
    }else{
      composant.componentInstance.mode='contrat';
    }

  }
  delete(id:string){
      this.factureService.delete(id).subscribe({
        next: () => {
          this.toastService.success("Suppression succes");
          this.loadData();
        },
        error: () => {
          this.toastService.error("Erreur de suppression");
        }

      })
  }
  openDeleteModal( id: string) {
    const composant = this.modalService.open(YesNoWarningComponent);
    composant.componentInstance.message = "Voulez-vous vraiment supprimer cette facture ? Cette action est irréversible.";
    composant.componentInstance.confirm.subscribe({
      next: () => {
        this.delete(id);
      }
    });
    composant.componentInstance.decline.subscribe({
      next: () => {
        composant.close();
      }
    });
  }


}
