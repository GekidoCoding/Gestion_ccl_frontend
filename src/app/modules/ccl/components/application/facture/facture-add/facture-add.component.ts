import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Mouvement} from "../../../../model/mouvement/mouvement";
import {MouvementListPopupComponent} from "../../mouvement/mouvement-list-popup/mouvement-list-popup.component";
import {Facture} from "../../../../model/facture/facture";
import {Etat} from "../../../../model/etat/etat";
import {EtatService} from "../../../../services/etat/etat.service";
import {ToastrService} from "ngx-toastr";
import {FactureService} from "../../../../services/facture/facture.service";
import {
  MouvementInfrasPopupComponent
} from "../../mouvement-infras-popup/mouvement-infras-popup/mouvement-infras-popup.component";
import {Frequence} from "../../../../model/frequence/frequence";
import {FrequenceService} from "../../../../services/frequence/frequence.service";
import { forkJoin } from 'rxjs';
import {MouvementService} from "../../../../services/mouvement/mouvement.service";

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
  frequenceSelected :Frequence = new Frequence();
  frequences: Frequence[] = [];
  isLoading: boolean = false;
  etats:Etat[]  =[];

ngOnInit(): void {
  forkJoin({
    etats: this.etatService.getEtatsFacture(),
    frequences: this.frequenceService.getAll(),
    remise: this.factureService.getRemise(),
    defaultFrequence: this.frequenceService.findDefaultFrequence(),
    etatProforma:this.etatService.getEtatProforma(),
    mouvementLoad:this.mouvementService.getById(this.mouvementSelected.id)
}).subscribe({
  next: (results) => {
    this.etats = results.etats;
    this.frequences = results.frequences;
    this.newItem.remise = results.remise;
    this.frequenceSelected = results.defaultFrequence;
    this.newItem.etat=results.etatProforma;
    this.newItem.mouvement = results.mouvementLoad;
    this.initFacture(results.mouvementLoad);
  },
  error: (err) => {
    this.toastr.error("Erreur lors du chargement initial");
    console.error(err);
  }
});
}

constructor(
      public activeModal: NgbActiveModal,
      private modalService: NgbModal,
      private etatService: EtatService,
      private toastr: ToastrService,
      private factureService: FactureService,
      private frequenceService: FrequenceService,
      private mouvementService: MouvementService,

  ) { }


  initFacture(mouvement: Mouvement) {
    this.factureService.getDefaultProforma(mouvement.id).subscribe({
      next: data => {
        this.newItem = data;
      },
      error: err => {
        const message = err.error?.message || "Erreur inconnue";
        this.toastr.error(message);
        this.activeModal.close();
      }
    });
  }

  functionAddAction(): void {
    this.newItem.dhCreation ='';
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
  openInfrasPopup(mouvement: Mouvement) {
    const modal = this.modalService.open(MouvementInfrasPopupComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modal.componentInstance.mouvementInfras = mouvement.mouvementInfras || [];
    modal.componentInstance.mouvementId = mouvement.id;
    modal.componentInstance.afterEmit.subscribe(() => {
      this.ngOnInit();
    })
  }

}