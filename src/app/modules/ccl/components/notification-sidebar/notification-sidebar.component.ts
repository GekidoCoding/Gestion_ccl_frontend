import { Component, EventEmitter, Output } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-notification-sidebar',
  templateUrl: './notification-sidebar.component.html',
  styleUrls: ['./notification-sidebar.component.scss'],
})
export class NotificationSidebarComponent {

  constructor(
      public activeModal: NgbActiveModal,
  ) {
  }
}