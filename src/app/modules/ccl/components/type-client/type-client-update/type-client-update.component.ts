import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {TypeClient} from "../../../model/type-client/type-client";
import {TypeClientService} from "../../../services/type-client/type-client.service";

@Component({
  selector: 'app-type-client-update',
  templateUrl: './type-client-update.component.html',
  styleUrls: ['./type-client-update.component.scss']
})
export class TypeClientUpdateComponent {
  @Input() typeClient!: TypeClient;
  @Output() afterUpdate = new EventEmitter<void>();

  constructor(
      public activeModal: NgbActiveModal,
      private service: TypeClientService
  ) {}

  updateItem(form: NgForm) {
    if (form.invalid) return;

    const typeClient: TypeClient = new TypeClient();
    typeClient.id = this.typeClient.id;
    typeClient.typeClient = this.typeClient.typeClient;

    this.service.update(this.typeClient.id, typeClient).subscribe({
      next: () => {
        this.afterUpdate.emit();
        this.activeModal.close('Save click');
      },
      error: (error) => {
        console.error('Error updating type client:', error);
        this.activeModal.dismiss('Error');
      }
    });
  }
}