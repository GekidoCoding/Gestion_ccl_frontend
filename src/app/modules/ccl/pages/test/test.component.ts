import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {FactureAddComponent} from "../../components/application/facture/facture-add/facture-add.component";
import {
  FactureListPopupComponent
} from "../../components/application/facture/facture-list-popup/facture-list-popup.component";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(
      private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }
  handlePopupTest(){
    const options :NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(FactureAddComponent, options);
  }
  handleFactureListTest(){
    const options :NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(FactureListPopupComponent, options);
  }
}
