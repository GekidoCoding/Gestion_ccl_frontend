import { Component, Input, OnInit } from '@angular/core';
import { Infrastructure } from '../../../model/infrastructure/infrastructure';
import { InfraTarif } from '../../../model/infra-tarif/infra-tarif';
import { Frequence } from '../../../model/frequence/frequence';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FrequenceService } from '../../../services/frequence/frequence.service';
import { ToastrService } from 'ngx-toastr';
import { InfrastructureService } from '../../../services/infrastructure/infrastructure.service';
import {InfraTarifService} from "../../../services/infra-tarif/infra-tarif.service";

@Component({
  selector: 'app-infra-tarif-listpopup',
  templateUrl: './infra-tarif-listpopup.component.html',
  styleUrls: ['./infra-tarif-listpopup.component.scss'],
})
export class InfraTarifListpopupComponent implements OnInit {
  @Input() infrastructureId: string = '';
  selectedInfrastructure: Infrastructure = new Infrastructure();
  isLoading = false;
  newInfraTarif: InfraTarif = new InfraTarif();
  frequences: Frequence[] = [];
  filteredFrequences: Frequence[] = [];

  constructor(
      public activeModal: NgbActiveModal,
      private frequenceService: FrequenceService,
      public toastr: ToastrService,
      private infrastructureService: InfrastructureService ,
      private infraTarifService: InfraTarifService,
  ) {}

  ngOnInit(): void {
    this.loadFrequences();
    this.loadInfrastructure();
  }

  loadInfrastructure() {
    this.isLoading = true;
    this.infrastructureService.getById(this.infrastructureId).subscribe({
      next: (data) => {
        this.selectedInfrastructure = data;
        this.newInfraTarif.infrastructure = data;
        this.filterFrequences();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Error fetching infrastructure');
        this.isLoading = false;
      },
    });
  }

  loadFrequences() {
    this.frequenceService.getAll().subscribe({
      next: (data) => {
        this.frequences = data;
        this.filterFrequences();
      },
      error: (error) => {
        console.log(error);
        this.toastr.error('Error fetching frequences');
      },
    });
  }

  filterFrequences() {
    const usedFrequenceIds = (this.selectedInfrastructure.infraTarifs || []).map(
        (tarif: InfraTarif) => tarif.frequence.id
    );

    this.filteredFrequences = this.frequences.filter(
        (frequence: Frequence) => !usedFrequenceIds.includes(frequence.id)
    );
  }

  addTarif() {
    this.infraTarifService.create(this.newInfraTarif).subscribe({
      next: (data) => {
        this.newInfraTarif = new InfraTarif();
        this.ngOnInit();
        this.toastr.success('Tarif de l\'infrastructure inséré et ajouté avec succès');
      },
      error: (error) => {
        this.toastr.error("Erreur lors de l\'insertion de l'infrastructure");
      }
    })
  }

  deleteTarif(id: string) {
      this.infraTarifService.delete(id).subscribe({
        next: (data) => {
          this.ngOnInit();
          this.toastr.success("Suppression du Tarif de l ' infrastructure avec succes !")
        },
        error: (error) => {
          this.toastr.error("Erreur lors de la suppression du tarif de l'infrastructure");
        }

      })
  }
}