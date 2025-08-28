import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Infrastructure } from '../../../model/infrastructure/infrastructure';
import { TypeMouvement } from '../../../model/type-mouvement/type-mouvement';
import { Client } from '../../../model/client/client';
import { Mouvement } from '../../../model/mouvement/mouvement';
import { ClientService } from '../../../services/client/client.service';
import { TypeMouvementService } from '../../../services/type-mouvement/type-mouvement.service';
import { MouvementService } from '../../../services/mouvement/mouvement.service';
import { Facture } from '../../../model/facture/facture';
import { FactureAddComponent } from '../facture/facture-add/facture-add.component';

@Component({
  selector: 'app-mouvement-add',
  templateUrl: './mouvement-add.component.html',
  styleUrls: ['./mouvement-add.component.scss']
})
export class MouvementAddComponent implements OnInit {
  @Input() infrastructure: Infrastructure = new Infrastructure();
  @Input() client: Client = new Client();
  @Output() afterAdd = new EventEmitter<void>();

  typeMouvements: TypeMouvement[] = [];
  clients: Client[] = [];
  newItem: Mouvement = new Mouvement();
  isReservation: boolean = false;
  filteredTypeMouvements: TypeMouvement[] = [];
  facture: Facture = new Facture();
  mouvementForm: FormGroup;
  isLoading = false;
  infrastructures : Infrastructure[] = [];


  constructor(
      public activeModal: NgbActiveModal,
      private modalService: NgbModal,
      private toastr: ToastrService,
      private clientService: ClientService,
      private typeMouvementService: TypeMouvementService,
      private service: MouvementService,
      private fb: FormBuilder
  ) {
    this.mouvementForm = this.fb.group(
        {
          typeMouvement: [null, Validators.required],
          infrastructureId: [null, Validators.required],
          clientId: [null, Validators.required],
          periodeDebut: ['', this.dateNotAfterTodayValidator()],
          periodeFin: [''],
          nombre: [0]
        },
        {
          validators: [this.dateRangeValidator(), this.capacityValidator()]
        }
    );
  }

  ngOnInit() {
    this.loadClients();
    this.loadTypeMouvements();
    if (this.client.id) {
      this.newItem.client = this.client;
      this.mouvementForm.patchValue({ clientId: this.client.id });
    }
    if (this.infrastructure.id) {
      this.newItem.infrastructure = this.infrastructure;
      this.mouvementForm.patchValue({ infrastructureId: this.infrastructure.id });
    }
    // Debug form errors
    this.mouvementForm.valueChanges.subscribe(() => {
      console.log('Form errors:', this.mouvementForm.errors);
      console.log('Nombre errors:', this.mouvementForm.get('nombre')?.errors);
      console.log('PeriodeDebut errors:', this.mouvementForm.get('periodeDebut')?.errors);
      console.log('PeriodeFin errors:', this.mouvementForm.get('periodeFin')?.errors);
    });
  }

  dateNotAfterTodayValidator() {
    return (control: any) => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return selectedDate > today ? { dateAfterToday: true } : null;
    };
  }

  dateRangeValidator() {
    return (formGroup: FormGroup) => {
      const periodeDebut = formGroup.get('periodeDebut')?.value;
      const periodeFin = formGroup.get('periodeFin')?.value;
      if (!periodeDebut || !periodeFin) return null;
      const startDate = new Date(periodeDebut);
      const endDate = new Date(periodeFin);
      return endDate < startDate ? { invalidDateRange: true } : null;
    };
  }

  capacityValidator() {
    return (formGroup: FormGroup) => {
      const nombre = formGroup.get('nombre')?.value;
      const infrastructureId = formGroup.get('infrastructureId')?.value;
      console.log('capacityValidator:', {
        nombre,
        infrastructureId,
        capacite: this.newItem.infrastructure?.capacite
      });
      if (!nombre || !infrastructureId) return null;
      const capacite = this.newItem.infrastructure?.capacite ?? 0;
      if (capacite && nombre > capacite) {
        console.log('Setting invalidCapacity error');
        return { invalidCapacity: true };
      }
      return null;
    };
  }

  loadClients() {
    this.isLoading = true;
    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.toastr.error('Erreur lors du chargement des clients');
        this.isLoading = false;
      }
    });
  }

  loadTypeMouvements() {
    this.isLoading = true;
    this.typeMouvementService.getAll().subscribe({
      next: (objs) => {
        this.typeMouvements = objs;
        this.filteredTypeMouvements = objs;
        if (this.filteredTypeMouvements.length > 0) {
          this.mouvementForm.patchValue({ typeMouvement: this.filteredTypeMouvements[0].id });
          this.onTypeMouvementChange();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading type de mouvements:', error);
        this.toastr.error('Erreur lors du chargement des type de mouvements');
        this.isLoading = false;
      }
    });
  }

  onTypeMouvementChange() {
    const selectedType = this.typeMouvements.find(type => type.id === this.mouvementForm.get('typeMouvement')?.value);
    this.isReservation = selectedType?.nom !== 'Renseignement';
    if (!this.isReservation) {
      this.mouvementForm.patchValue({
        periodeDebut: '',
        periodeFin: '',
        nombre: 0
      });
      this.mouvementForm.get('periodeDebut')?.clearValidators();
      this.mouvementForm.get('periodeFin')?.clearValidators();
      this.mouvementForm.get('nombre')?.clearValidators();
    } else {
      this.mouvementForm.get('periodeDebut')?.setValidators([Validators.required, this.dateNotAfterTodayValidator()]);
      this.mouvementForm.get('periodeFin')?.setValidators([Validators.required]);
      this.mouvementForm.get('nombre')?.setValidators([Validators.required, Validators.min(1)]);
    }
    this.mouvementForm.get('periodeDebut')?.updateValueAndValidity();
    this.mouvementForm.get('periodeFin')?.updateValueAndValidity();
    this.mouvementForm.get('nombre')?.updateValueAndValidity();
    this.mouvementForm.updateValueAndValidity();
  }

  allActions() {
    if (this.mouvementForm.valid) {
      this.isLoading = true;
      const selectedTypeMouvement = this.typeMouvements.find(
          type => type.id === this.mouvementForm.get('typeMouvement')?.value
      );
      if (!selectedTypeMouvement) {
        this.toastr.error('Type de mouvement invalide.');
        this.isLoading = false;
        return;
      }
      const mouvement: Mouvement = {
        ...this.newItem,
        typeMouvement: selectedTypeMouvement,
        infrastructure: this.newItem.infrastructure,
        client: this.newItem.client,
        periodeDebut: this.mouvementForm.get('periodeDebut')?.value,
        periodeFin: this.mouvementForm.get('periodeFin')?.value,
        nombre: this.mouvementForm.get('nombre')?.value
      };
      this.addItem(mouvement, this.facture);
    } else {
      this.toastr.error('Veuillez remplir tous les champs requis correctement.');
      Object.keys(this.mouvementForm.controls).forEach(key => {
        this.mouvementForm.get(key)?.markAsTouched();
      });
    }
  }

  handleClientSelected(client: Client, content: any) {
    this.newItem.client = { ...client };
    this.mouvementForm.patchValue({ clientId: client.id });
    content.dismiss('Cross Click');
  }

  handleInfrastructureSelected(infra: Infrastructure, content: any) {
    this.newItem.infrastructure = { ...infra, capacite: infra.capacite ?? 1 };
    this.mouvementForm.patchValue({ infrastructureId: infra.id });
    this.mouvementForm.get('nombre')?.updateValueAndValidity();
    this.mouvementForm.updateValueAndValidity();
    content.dismiss('Cross Click');
    console.log('Selected infrastructure:', this.newItem.infrastructure);
  }

  openPopup(content: any) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  isFormValid(): boolean {
    return this.mouvementForm.valid;
  }

  openFacture(mouvement: Mouvement) {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(FactureAddComponent, options);
    component.componentInstance.mouvementSelected = mouvement;
    component.componentInstance.title = 'Voulez-vous enregistrer cette facture proforma pour cette réservation ?';
    component.componentInstance.afterAction.subscribe(() => this.afterAdd.emit());
  }

  addItem(mouvement: Mouvement, facture: Facture) {
    console.log('Mouvement to create:', JSON.stringify(mouvement));
    if (mouvement.periodeDebut) {
      mouvement.periodeDebut = mouvement.periodeDebut + ':00';
    }
    if (mouvement.periodeFin) {
      mouvement.periodeFin = mouvement.periodeFin + ':00';
    }
    if (mouvement.dhMouvement) {
      mouvement.dhMouvement = mouvement.dhMouvement + ':00';
    }
    this.service.create(mouvement).subscribe({
      next: (created: Mouvement) => {
        this.toastr.success('Mouvement ajouté avec succès !');
        this.activeModal.close();
        if (created.typeMouvement.id !== 'TPM-00000001') {
          this.openFacture(created);
        }
        this.afterAdd.emit();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Erreur lors de l\'ajout du mouvement');
        this.isLoading = false;
      }
    });
  }
}