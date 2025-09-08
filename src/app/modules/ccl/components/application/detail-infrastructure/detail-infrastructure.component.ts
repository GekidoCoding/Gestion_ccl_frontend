import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Infrastructure } from '../../../model/infrastructure/infrastructure';
import { InfrastructureService } from '../../../services/infrastructure/infrastructure.service';
import { Localisation } from '../../../model/localisation/localisation';
import { LocalisationService } from '../../../services/localisation/localisation.service';
import { Etat } from '../../../model/etat/etat';
import { EtatService } from '../../../services/etat/etat.service';
import { ModeleInfra } from '../../../model/modele-infra/modele-infra';
import { ModeleInfraService } from '../../../services/modele-infra/modele-infra.service';
import { CategorieInfra } from '../../../model/categorie-infra/categorie-infra';
import { CategorieInfraService } from '../../../services/categorie-infra/categorie-infra.service';
import { Router } from '@angular/router';
import { MouvementAddComponent } from '../mouvement-add/mouvement-add.component';
import { Frequence } from '../../../model/frequence/frequence';
import { FrequenceService } from '../../../services/frequence/frequence.service';
import { InfraTarif } from '../../../model/infra-tarif/infra-tarif';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-detail-infrastructure',
  templateUrl: './detail-infrastructure.component.html',
  styleUrls: ['./detail-infrastructure.component.scss']
})
export class DetailInfrastructureComponent implements OnInit {
  @Input() infrastructureId!: string;
  @Output() loadData = new EventEmitter<void>();
  @ViewChild('detailForm') detailForm!: NgForm;

  selectedItem: Infrastructure | null = null;
  localisations: Localisation[] = [];
  etats: Etat[] = [];
  categories: CategorieInfra[] = [];
  modeles: ModeleInfra[] = [];
  filteredModeles: ModeleInfra[] = [];
  newLocalisation: Localisation = new Localisation();
  newModele: ModeleInfra = new ModeleInfra();
  newCategory: CategorieInfra = new CategorieInfra();
  frequences: Frequence[] = [];
  availableFrequences: Frequence[] = [];
  selectedFrequenceId: string | null = null;
  newTarif: number | null = null;
  allModeles: ModeleInfra[] = [];
  isEditing = false;
  isLoading = true;
  tarifsValid: boolean = true;
  elementsValid: boolean = true;
  capaciteValid: boolean = true;

  constructor(
      public activeModal: NgbActiveModal,
      private router: Router,
      private modalService: NgbModal,
      private service: InfrastructureService,
      private localisationService: LocalisationService,
      private etatService: EtatService,
      private modeleInfraService: ModeleInfraService,
      private catInfraService: CategorieInfraService,
      private frequenceService: FrequenceService,
      private toastr: ToastrService
  ) {
    this.newModele.catInfra = new CategorieInfra();
  }

  ngOnInit() {
    this.isLoading = true;
    forkJoin({
      localisations: this.localisationService.getAll(),
      etats: this.etatService.getEtatAutre(),
      categories: this.catInfraService.getAll(),
      modeles: this.modeleInfraService.getAll(),
      frequences: this.frequenceService.getAll(),
      infrastructure: this.service.getById(this.infrastructureId),
      // frequenceDefaultId:this.frequenceService.findDefaultFrequence(),
    }).subscribe({
      next: ({ localisations, etats, categories, modeles, frequences, infrastructure }) => {
        this.localisations = localisations;
        this.etats = etats;
        this.categories = categories.map(cat => ({ ...cat, id: String(cat.id) })); // Normalize id to string
        this.modeles = modeles.map(mod => ({ ...mod, id: String(mod.id), catInfra: { ...mod.catInfra, id: String(mod.catInfra.id) } })); // Normalize ids
        this.allModeles = [...this.modeles];
        this.frequences = frequences;
        // this.selectedFrequenceId=frequenceDefaultId;
        this.selectedItem = {
          ...infrastructure,
          localisation: { ...infrastructure.localisation, id: String(infrastructure.localisation.id) },
          etat: { ...infrastructure.etat, id: String(infrastructure.etat.id) },
          modeleInfra: {
            ...infrastructure.modeleInfra,
            id: String(infrastructure.modeleInfra.id),
            catInfra: { ...infrastructure.modeleInfra.catInfra, id: String(infrastructure.modeleInfra.catInfra.id) }
          },
          infraTarifs: infrastructure.infraTarifs ? [...infrastructure.infraTarifs] : []
        };
        this.filteredModeles = this.allModeles.filter(m => m.catInfra.id === this.selectedItem?.modeleInfra?.catInfra?.id);
        this.validateTarifs();
        this.validateElements();
        this.validateCapacite();
        this.updateAvailableFrequences();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.toastr.error('Erreur lors du chargement des données');
        this.isLoading = false;
      }
    });
  }

  updateAvailableFrequences() {
    const usedFrequenceIds = new Set(this.selectedItem?.infraTarifs?.map(tarif => tarif.frequence.id) || []);
    this.availableFrequences = this.frequences.filter(frequence => !usedFrequenceIds.has(frequence.id));
  }

  validateTarifs() {
    this.tarifsValid = (this.selectedItem?.infraTarifs && this.selectedItem.infraTarifs.length > 0) ?? false;
  }

  validateElements() {
    this.elementsValid = !!this.selectedItem?.elements && this.selectedItem.elements.trim().length > 0;
  }

  validateCapacite() {
    this.capaciteValid = !this.selectedItem?.capacite || this.selectedItem.capacite > 0;
  }

  addTarif() {
    if (this.selectedFrequenceId && this.newTarif && this.newTarif > 0 && this.selectedItem) {
      const frequence = this.frequences.find(f => f.id === this.selectedFrequenceId);
      if (frequence) {
        const infraTarif = new InfraTarif();
        infraTarif.frequence = frequence;
        infraTarif.tarifInfra = this.newTarif;
        infraTarif.infrastructure = new Infrastructure();
        this.selectedItem.infraTarifs = this.selectedItem.infraTarifs || [];
        this.selectedItem.infraTarifs.push(infraTarif);
        this.updateAvailableFrequences();
        this.selectedFrequenceId = null;
        this.newTarif = null;
        this.validateTarifs();
        this.toastr.success('Tarif ajouté à la liste');
      }
    }
  }

  removeTarif(index: number) {
    if (this.selectedItem && this.selectedItem.infraTarifs) {
      this.selectedItem.infraTarifs.splice(index, 1);
      this.updateAvailableFrequences();
      this.validateTarifs();
      this.toastr.success('Tarif supprimé de la liste');
    }
  }

  onFrequenceChange(frequenceId: string) {
    this.selectedFrequenceId = frequenceId;
  }


  onCategoryChange(categoryId: string) {
    if (this.selectedItem) {
      this.filteredModeles = this.allModeles.filter(m => m.catInfra.id === categoryId);
      const currentModele = this.allModeles.find(m => m.id === this.selectedItem!.modeleInfra!.id);
      if (!categoryId || (currentModele && currentModele.catInfra.id !== categoryId)) {
        this.selectedItem.modeleInfra!.id = '';
      }
    } else {
      this.filteredModeles = [...this.allModeles];
    }
  }

  toggleEditMode() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.ngOnInit();
    this.isEditing = false;
  }

  update() {
    this.detailForm.control.markAllAsTouched();
    this.validateTarifs();
    this.validateElements();
    this.validateCapacite();

    if (this.selectedItem && this.detailForm.valid && this.tarifsValid) {
      const updatedInfrastructure: Infrastructure = {
        ...this.selectedItem,
        localisation: this.localisations.find(loc => loc.id === this.selectedItem!.localisation!.id) || new Localisation(),
        etat: this.etats.find(e => e.id === this.selectedItem!.etat!.id) || new Etat(),
        modeleInfra: {
          ...this.selectedItem.modeleInfra,
          catInfra: this.categories.find(cat => cat.id === this.selectedItem!.modeleInfra!.catInfra.id) || new CategorieInfra()
        },
        infraTarifs: this.selectedItem.infraTarifs || []
      };
      this.service.update(this.selectedItem.id, updatedInfrastructure).subscribe({
        next: () => {
          this.isEditing = false;
          this.loadData.emit();
          this.toastr.success('Infrastructure mise à jour avec succès !');
        },
        error: (error) => {
          console.error('Error updating infrastructure:', error);
          this.toastr.error('Erreur lors de la mise à jour de l\'infrastructure');
        }
      });
    }
  }

  addMouvementInfra() {
    const options: NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    const component = this.modalService.open(MouvementAddComponent, options);
    component.componentInstance.infrastructure = this.selectedItem;
    component.componentInstance.newItem.infrastructure = this.selectedItem;
  }
}