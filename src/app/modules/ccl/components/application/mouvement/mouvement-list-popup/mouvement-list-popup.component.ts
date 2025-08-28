import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Mouvement } from "../../../../model/mouvement/mouvement";
import { MouvementService } from "../../../../services/mouvement/mouvement.service";
import { ToastrService } from "ngx-toastr";
import { MouvementDetailComponent } from "../../mouvement-detail/mouvement-detail.component";
import { MouvementAddComponent } from "../../mouvement-add/mouvement-add.component";

@Component({
  selector: 'app-mouvement-list-popup',
  templateUrl: './mouvement-list-popup.component.html',
  styleUrls: ['./mouvement-list-popup.component.scss']
})
export class MouvementListPopupComponent implements OnInit {
  @Output() handleSelected = new EventEmitter<Mouvement>();
  @Input() mouvementSelected: Mouvement | undefined = new Mouvement();
  items: Mouvement[] = [];

  constructor(
      public activeModal: NgbActiveModal,
      private service: MouvementService,
      private toastr: ToastrService,
      private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  selectionned(id: string) {
    const selectedMouvement = this.items.find(item => item.id === id);
    if (selectedMouvement) {
      this.mouvementSelected = selectedMouvement;
      this.handleSelected.emit(this.mouvementSelected);
      this.activeModal.close();
    } else {
      this.toastr.error("Mouvement non trouvé");
    }
  }

  loadData(): void {
    this.service.getCalendarData().subscribe({
      next: data => {
        this.items = data;
      },
      error: () => {
        this.toastr.error("Erreur lors du chargement des mouvements");
      }
    });
  }

  openDetailModal(id: string): void {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(MouvementDetailComponent, options);
    component.componentInstance.mouvementId = id;
  }

  openAddModal(): void {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(MouvementAddComponent, options);
  }
}