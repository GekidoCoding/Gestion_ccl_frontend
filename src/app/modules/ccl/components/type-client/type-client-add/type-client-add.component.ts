import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {TypeClient} from "../../../model/type-client/type-client";
import {TypeClientService} from "../../../services/type-client/type-client.service";

@Component({
  selector: 'app-type-client-add',
  templateUrl: './type-client-add.component.html',
  styleUrls: ['./type-client-add.component.scss']
})
export class TypeClientAddComponent {
  @Output() afterAdd = new EventEmitter<void>();
  newItem: Partial<TypeClient> = { typeClient: '' };

  constructor(
      public activeModal: NgbActiveModal,
      private service: TypeClientService
  ) {}

  addItem(form: NgForm) {
    if (form.invalid) return;

    const typeClient: TypeClient = new TypeClient();
    typeClient.typeClient = this.newItem.typeClient!;

    this.service.create(typeClient).subscribe({
      next: () => {
        this.afterAdd.emit();
        this.activeModal.close('Save click');
      },
      error: (error) => {
        console.error('Error adding type client:', error);
        this.activeModal.dismiss('Error');
      }
    });
  }
}