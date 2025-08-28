import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Facture} from "../../../../model/facture/facture";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FactureService} from "../../../../services/facture/facture.service";
import {ToastrService} from "ngx-toastr";
import {
  HistoFactureListPopupComponent
} from "../../histo-facture/histo-facture-list-popup/histo-facture-list-popup.component";
import {Etat} from "../../../../model/etat/etat";
import {EtatService} from "../../../../services/etat/etat.service";

@Component({
  selector: 'app-facture-detail',
  templateUrl: './facture-detail.component.html',
  styleUrls: ['./facture-detail.component.scss']
})
export class FactureDetailComponent implements OnInit {
  @Input() selectedItem:Facture = new Facture();
  @Output() afterAction = new EventEmitter<void>();
  isEditing = false;
  etats:Etat[]=[];

  constructor(
      public activeModal: NgbActiveModal,
      private service :FactureService,
      public toastr: ToastrService,
      private modalService: NgbModal,
      private etatService: EtatService
  ) {}

  ngOnInit(): void {
    this.loadFacture();
    this.loadEtats();
  }
  loadEtats(){
    this.etatService.getAll().subscribe({
      next: data => {
        this.etats = data;
      },
      error: error => {
        this.toastr.error("Erreur lors du chargement des etats ")
      }
    })
  }
  loadFacture(){
    this.service.getById(this.selectedItem.id).subscribe({
      next: data => {
        this.selectedItem = data;
      },
      error: err => {
        console.log(err);
        this.toastr.error("Erreur lors du chargement du facture !");
      }
    })
  }
  toggleEditMode() {
    this.isEditing = true;
  }
  update(){
    this.selectedItem.dhCreation='';
    this.service.udpate(this.selectedItem.id, this.selectedItem).subscribe({
      next: () => {
        this.isEditing = false;
        this.loadFacture();
        this.toastr.success('Facture mise à jour avec succès !');
        this.afterAction.emit();
      },
      error: (error) => {
        console.error('Error updating facture:', error);
        this.toastr.error('Erreur lors de la mise à jour du facture');
      }
    });
  }
  cancelEdit() {
    if (this.selectedItem) {
      this.service.getById(this.selectedItem.id).subscribe({
        next: (data) => {
          this.selectedItem = data;
          this.isEditing = false;
          this.afterAction.emit();
        },
        error: (error) => {
          console.error('Error reloading facture details:', error);
          this.toastr.error('Erreur lors du rechargement des détails');
        }
      });
    }
  }

  openHistory(){
    const options= {size:'lg', centered:true};
    const component = this.modalService.open(HistoFactureListPopupComponent,options);
    component.componentInstance.selected = this.selectedItem;

  }
}
