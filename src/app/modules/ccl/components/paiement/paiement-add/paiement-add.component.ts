import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Facture} from "../../../model/facture/facture";
import {FactureService} from "../../../services/facture/facture.service";
import {PaiementService} from "../../../services/paiement/paiement.service";
import {ToastrService} from "ngx-toastr";
import {Paiement} from "../../../model/paiement/paiement";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ModePaiementService} from "../../../services/mode-paiement/mode-paiement.service";
import {ModePaiement} from "../../../model/mode-paiement/mode-paiement";

@Component({
  selector: 'app-paiement-add',
  templateUrl: './paiement-add.component.html',
  styleUrls: ['./paiement-add.component.scss']
})
export class PaiementAddComponent implements OnInit {
  @Input() factureId: string='';
  @Input() factureSelected=new Facture();
  @Output() afterAdd=new EventEmitter<Paiement>();

  newPaiement:Paiement = new Paiement();
  isLoading:boolean = false;
  modePaiements:ModePaiement[]=[];
  constructor(
      private factureService: FactureService,
      private paiementService: PaiementService,
      public toastr: ToastrService,
      public activeModal: NgbActiveModal,
      private modePaiementService: ModePaiementService,
  ) { }


  ngOnInit(): void {
    this.loadFacture();
    this.loadModePaiement();
  }

  loadModePaiement(){
    this.modePaiementService.getAll().subscribe({
      next: data => {
        this.modePaiements = data;
      } ,
      error:()  => {
        this.toastr.error("Erreur lors du chargement des paiements ");
      }
    })
  }
  loadFacture(){
    if(!this.factureSelected.id){
      this.factureService.getById(this.factureId).subscribe({
        next: data => {
          console.log(JSON.stringify( data));
          this.factureSelected=data;
        },
        error: err => {
          this.toastr.error("Erreur lors du chargement du facture ");
        }
      })
    }
  }

  create (){
    this.newPaiement.facture.id = this.factureSelected.id;
    console.log(JSON.stringify(this.newPaiement));
    this.paiementService.create(this.newPaiement).subscribe({
      next: () => {
        this.toastr.success("insertion de paiement avec succes ");
        this.afterAdd.emit();
        this.activeModal.close();
      },
      error: (error) => {
        console.log(JSON.stringify(error));
        this.toastr.error(error.error.message);
      }
    })
  }


}
