import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Client } from '../../../model/client/client';
import { TypeClient } from '../../../model/type-client/type-client';
import { TypeClientService } from '../../../services/type-client/type-client.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-add-form',
  templateUrl: './client-add-form.component.html',
  styleUrls: ['./client-add-form.component.scss']
})
export class ClientAddFormComponent implements  OnInit{
  @Input() isLoading: boolean = false;
  @Output() formSubmit = new EventEmitter<Client>();
  @Output() formCancel = new EventEmitter<void>();

  typeClients: TypeClient[] = [];
  isEntreprise: boolean = false;
  addForm!: FormGroup;

  constructor(
      private fb: FormBuilder,
      private typeClientService: TypeClientService,
      private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadTypeClients();
  }

  initForm() {
    this.addForm = this.fb.group(
        {
          typeClient: [null, Validators.required],
          nom: [''],
          prenom: [''],
          raisonSociale: [''],
          adresse: [''],
          cin: ['', [Validators.required, Validators.pattern(/^\d{12,}$/)]],
          contacts: ['', [Validators.required, Validators.pattern(/^(\+261|0)[0-9]{9}$/)]],
          email: ['', Validators.email],
          fonction: ['']
        },
        { validators: this.nomPrenomValidator }
    );
  }

  nomPrenomValidator(group: AbstractControl) {
    const nom = group.get('nom')?.value;
    const prenom = group.get('prenom')?.value;

    if (!nom && !prenom) {
      group.get('nom')?.setErrors({ required: true });
      group.get('prenom')?.setErrors({ required: true });
    } else {
      if (nom) group.get('prenom')?.setErrors(null);
      if (prenom) group.get('nom')?.setErrors(null);
    }
    return null;
  }

  onTypeClientChange() {
    this.typeClientService.getPersonneId().subscribe({
      next: (personneId) => {
        this.isEntreprise = this.addForm.get('typeClient')?.value !== personneId;

        if (this.isEntreprise) {
          this.addForm.get('raisonSociale')?.setValidators([Validators.required]);
          this.addForm.get('nom')?.clearValidators();
          this.addForm.get('prenom')?.clearValidators();
          this.addForm.get('cin')?.clearValidators();
        } else {
          this.addForm.get('raisonSociale')?.clearValidators();
          this.addForm.get('nom')?.setValidators([]);
          this.addForm.get('prenom')?.setValidators([]);
          this.addForm.get('cin')?.setValidators([Validators.required]);
        }
        this.addForm.updateValueAndValidity();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l’ID personne :', error);
      }
    });
  }

  loadTypeClients() {
    this.isLoading = true;
    this.typeClientService.getAll().subscribe({
      next: (types) => {
        this.typeClients = types;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types de client:', error);
        this.toastr.error('Erreur lors du chargement des types de client');
        this.isLoading = false;
      }
    });
  }

  submitForm() {
    if (this.addForm.valid) {
      const obj: Client = this.addForm.value;
      obj.typeClient = { id: this.addForm.controls['typeClient'].value } as TypeClient;
      this.formSubmit.emit(obj);
      this.addForm.reset();
    }
  }


  cancelForm() {
    this.formCancel.emit();
    this.addForm.reset();
  }

  get f() {
    return this.addForm.controls;
  }
}
