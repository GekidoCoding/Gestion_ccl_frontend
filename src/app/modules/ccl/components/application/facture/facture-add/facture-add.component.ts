import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Mouvement} from "../../../../model/mouvement/mouvement";
import {MouvementListPopupComponent} from "../../mouvement/mouvement-list-popup/mouvement-list-popup.component";
import {Facture} from "../../../../model/facture/facture";
import {Etat} from "../../../../model/etat/etat";
import {EtatService} from "../../../../services/etat/etat.service";
import {ToastrService} from "ngx-toastr";
import {FactureService} from "../../../../services/facture/facture.service";

@Component({
  selector: 'app-facture-add',
  templateUrl: './facture-add.component.html',
  styleUrls: ['./facture-add.component.scss']
})
export class FactureAddComponent implements OnInit {
  @Output() afterAction = new EventEmitter<void>();
  @Input() title:string ="Ajouter une Facture";
  @Input() newItem: Facture = new Facture();
  @Input() mouvementSelected: Mouvement=new Mouvement();
  etats:Etat[]  =[];

  constructor(
      public activeModal: NgbActiveModal,
      private modalService: NgbModal,
      private etatService: EtatService,
      private toastr: ToastrService,
      private factureService: FactureService,

  ) { }

  ngOnInit(): void {

    if(this.mouvementSelected.id){
      this.newItem.mouvement=this.mouvementSelected;
      this.factureService.getRemise().subscribe({
        next: res=>{
          this.newItem.remise=res;
          this.newItem.acompteVerse= (this.mouvementSelected.infrastructure.prix) * (res / 100);
          this.newItem.montantTotal=this.mouvementSelected.infrastructure.prix;
        }
      });
    }
    this.loadEtats();

  }
  loadEtats() {

    this.etatService.getAll().subscribe({
      next: (etats) => {
        this.etats = etats;
        this.newItem.etat =this.etats.find(e=>e.etat=="Proformat")!
      },

      error: (error) => {
        this.toastr.error('Erreur lors du chargement des états') ;
      }
    });
  }
  functionAddAction(): void {
    console.log('Facture à sauvegarder : ', this.newItem);
    this.newItem.gestionnaire = null;
    this.factureService.create(this.newItem).subscribe({
      next: () => {
        this.toastr.success('Ajout de facture avec succès');
        this.afterAction.emit();
        this.activeModal.close();
      },
      error: () => {
        this.toastr.error('Erreur lors de l\'ajout de facture');
      }
    });
  }



  handleSelected(selectedMouvement: Mouvement): void {
    this.newItem.mouvement = selectedMouvement;
  }

  openListMouvement(): void {
    const options: NgbModalOptions = { size: 'lg', backdrop: 'static', centered: true };
    const component = this.modalService.open(MouvementListPopupComponent, options);
    component.componentInstance.mouvementSelected = this.newItem.mouvement;
    component.componentInstance.handleSelected.subscribe((mouvement: Mouvement) => {
      this.handleSelected(mouvement);
    });
  }

}