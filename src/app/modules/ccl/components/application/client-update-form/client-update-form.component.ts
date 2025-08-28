import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import {TypeClient} from "../../../model/type-client/type-client";
import {Client} from "../../../model/client/client";
import {Etat} from "../../../model/etat/etat";


@Component({
  selector: 'app-client-update-form',
  templateUrl: './client-update-form.component.html',
  styleUrls: ['./client-update-form.component.scss']
})
export class ClientUpdateFormComponent {
  @Input() client: Client = new Client();
  @Input() typeClients: TypeClient[] = [];
  @Output() formSubmit = new EventEmitter<Client>();
  @Output() formCancel = new EventEmitter<void>();

  onSubmit(form: NgForm) {
    if (form.valid) {
      const updatedClient: Client = {
        ...this.client,
        typeClient: this.typeClients.find(type => type.id === this.client.typeClient.id) || new TypeClient(),
        nom: !this.client.typeClient.id ? this.client.nom : '',
        prenom: !this.client.typeClient.id ? this.client.prenom : '',
        raisonSociale: this.client.typeClient.id ? this.client.raisonSociale : '',
        cin: !this.client.typeClient.id ? this.client.cin : '',
        adresse: this.client.adresse,
        contacts: this.client.contacts,
        email: this.client.email,
        fonction: this.client.fonction,
        etat: this.client.etat || new Etat()
      };
      this.formSubmit.emit(updatedClient);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}