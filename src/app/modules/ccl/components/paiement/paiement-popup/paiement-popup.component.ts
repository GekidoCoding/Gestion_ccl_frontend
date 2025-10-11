import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import {NgbActiveModal, NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {TypeClientService} from "../../../services/type-client/type-client.service";
import {PaiementService} from "../../../services/paiement/paiement.service";
import {Paiement} from "../../../model/paiement/paiement";
import {PaiementAddComponent} from "../paiement-add/paiement-add.component";
import {FactureService} from "../../../services/facture/facture.service";
import {Facture} from "../../../model/facture/facture";
import {WarningPopupComponent} from "../../warning-popup/warning-popup.component";
import {ConfigService} from "../../../services/config/config.service";


@Component({
  selector: 'app-paiement-popup',
  templateUrl: './paiement-popup.component.html',
  styleUrls: ['./paiement-popup.component.scss']
})

export class PaiementPopupComponent implements OnInit {
  @Input() idFacture: string='';
  items: Paiement[] = [];
  factureSelected:Facture  = new Facture();
  isLoading=false;
  codeReelle=-1;

  constructor(
      private modalService: NgbModal,
      private service: PaiementService,
      private factureService: FactureService,
      private toastr: ToastrService,
      public activeModal: NgbActiveModal,
      private configService: ConfigService,
  ) {}

  ngOnInit() {
    this.loadFacture();
    this.loadData();
    this.loadCodeReelle();

  }
  loadCodeReelle(){
    this.configService.getEtatCodeReelle().subscribe({
      next: data => {
        this.codeReelle=data;
      }
    })
  }
  loadFacture(){
    this.factureService.getById(this.idFacture).subscribe({
      next: data => {
        console.log(JSON.stringify( data));
        this.factureSelected=data;
      },
      error: err => {
        this.toastr.error("Erreur lors du chargement du facture ");
      }
    })
  }
  loadData() {
    this.isLoading = true;
    this.service.getByFactureId(this.idFacture).subscribe({
      next: (data) => {
        this.items = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading paiements:', error);
        this.toastr.error('Erreur lors du chargement des paiements');
        this.isLoading = false;
      }
    });
  }


  openAddModal() {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component= this.modalService.open(PaiementAddComponent, options);
    component.componentInstance.factureSelected = this.factureSelected;
    component.componentInstance.afterAdd.subscribe({
      next: () => {
        this.ngOnInit();
      }
    });
  }

  delete(id:string) {
    this.service.delete(id).subscribe({
      next: () => {
        this.toastr.success('Suppression du paiement avec succes');
        this.ngOnInit();
      },
      error: () => {
        this.toastr.error('Error de suppression du paiement');
      }
    })
  }

  export(id:string) {
    this.factureService.downloadFacturePaiement(id)
        .subscribe((file: Blob) => {
          const fileURL = window.URL.createObjectURL(file);
          const link = document.createElement('a');
          link.href = fileURL;
          link.download = 'facture.pdf';
          link.click();
          window.URL.revokeObjectURL(fileURL);
        });
  }

  openDeleteConfirmation(id:string) {
    const options: NgbModalOptions = {
      centered: true,
      backdrop: 'static',
      animation: true
    };

    const modalRef = this.modalService.open(WarningPopupComponent, options);
    modalRef.componentInstance.message = "Voulez-vous vraiment supprimer ce paiement ? Cette action est irréversible !";
    modalRef.componentInstance.confirm.subscribe({
      next: () => {
        this.delete(id);
        this.ngOnInit();
      }
    });
  }


}