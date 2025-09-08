import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Infrastructure } from '../../../model/infrastructure/infrastructure';
import { Localisation } from '../../../model/localisation/localisation';
import { Etat } from '../../../model/etat/etat';
import { CategorieInfra } from '../../../model/categorie-infra/categorie-infra';
import { ModeleInfra } from '../../../model/modele-infra/modele-infra';
import { InfraTarif } from '../../../model/infra-tarif/infra-tarif';
import { Frequence } from '../../../model/frequence/frequence';
import { LocalisationService } from '../../../services/localisation/localisation.service';
import { CategorieInfraService } from '../../../services/categorie-infra/categorie-infra.service';
import { ModeleInfraService } from '../../../services/modele-infra/modele-infra.service';
import { FrequenceService } from '../../../services/frequence/frequence.service';

@Component({
  selector: 'app-infrastructure-add-form',
  templateUrl: './infrastructure-add-form.component.html',
  styleUrls: ['./infrastructure-add-form.component.scss']
})
export class InfrastructureAddFormComponent implements OnInit {
  @Input() newItem: Infrastructure = new Infrastructure();
  @Input() localisations: Localisation[] = [];
  @Input() etats: Etat[] = [];
  @Input() categories: CategorieInfra[] = [];
  @Input() filteredModeles: ModeleInfra[] = [];
  @Output() submitForm = new EventEmitter<Infrastructure>();
  @Output() cancel = new EventEmitter<void>();
  @Output() categoryChange = new EventEmitter<string>();
  @ViewChild('addForm') addForm!: NgForm;
  newLocalisation: Localisation = new Localisation();
  newCategory: CategorieInfra = new CategorieInfra();
  newModele: ModeleInfra = new ModeleInfra();
  frequences: Frequence[] = [];
  availableFrequences: Frequence[] = [];
  selectedFrequenceId: string | null = null;
  newTarif: number | null = null;
  allModeles: ModeleInfra[] = [];
  tarifsValid: boolean = true;
  elementsValid: boolean = true;

  constructor(
      private modalService: NgbModal,
      public modal: NgbActiveModal,
      private localisationService: LocalisationService,
      private catInfraService: CategorieInfraService,
      private modeleInfraService: ModeleInfraService,
      private frequenceService: FrequenceService,
      private toastr: ToastrService
  ) {
    this.newModele.catInfra = new CategorieInfra();
    this.newItem.infraTarifs = [];
  }

  ngOnInit() {
    this.loadFrequences();
    this.loadFrequenceDefault();
    this.allModeles = [...this.filteredModeles];
    this.validateTarifs();
    this.validateElements();
  }

  loadFrequenceDefault() {
    this.frequenceService.findDefaultFrequence().subscribe({
      next: (data) => {
        this.selectedFrequenceId = data.id;
      },
      error: (error) => {
        console.error('Error loading default frequence:', error);
        this.toastr.error('Erreur lors du chargement de la fréquence par défaut');
      }
    });
  }

  loadFrequences() {
    this.frequenceService.getAll().subscribe({
      next: (frequences) => {
        this.frequences = frequences;
        this.updateAvailableFrequences();
      },
      error: (error) => {
        console.error('Error loading frequences:', error);
        this.toastr.error('Erreur lors du chargement des fréquences');
      }
    });
  }

  updateAvailableFrequences() {
    const usedFrequenceIds = new Set(this.newItem.infraTarifs?.map(tarif => tarif.frequence.id) || []);
    this.availableFrequences = this.frequences.filter(frequence => !usedFrequenceIds.has(frequence.id));
  }

  validateTarifs() {
    this.tarifsValid = this.newItem.infraTarifs && this.newItem.infraTarifs.length > 0;
  }

  validateElements() {
    this.elementsValid = !!this.newItem.elements && this.newItem.elements.trim().length > 0;
  }

  addTarif() {
    if (this.selectedFrequenceId && this.newTarif && this.newTarif > 0) {
      const frequence = this.frequences.find(f => f.id === this.selectedFrequenceId);
      if (frequence) {
        const infraTarif = new InfraTarif();
        infraTarif.frequence = frequence;
        infraTarif.tarifInfra = this.newTarif;
        infraTarif.infrastructure = new Infrastructure();
        this.newItem.infraTarifs!.push(infraTarif);
        this.updateAvailableFrequences();
        this.selectedFrequenceId = null;
        this.newTarif = null;
        this.validateTarifs();
        this.toastr.success('Tarif ajouté à la liste');
      }
    }
  }

  removeTarif(index: number) {
    this.newItem.infraTarifs!.splice(index, 1);
    this.updateAvailableFrequences();
    this.validateTarifs();
    this.toastr.success('Tarif supprimé de la liste');
  }

  onFrequenceChange(frequenceId: string) {
    this.selectedFrequenceId = frequenceId;
  }

  onSubmit(form: NgForm) {
    this.addForm.control.markAllAsTouched();
    this.validateTarifs();
    this.validateElements();

    if (form.valid && this.tarifsValid) {
      const obj: Infrastructure = this.newItem;
      this.submitForm.emit(obj);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  openLocalisationModal(content: any) {
    const options: NgbModalOptions = { size: 'sm', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  openCategoryModal(content: any) {
    const options: NgbModalOptions = { size: 'sm', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  openModeleModal(content: any) {
    const options: NgbModalOptions = { size: 'sm', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  addLocalisation() {
    this.localisationService.create(this.newLocalisation).subscribe({
      next: (localisation) => {
        this.localisations.push(localisation);
        this.newItem.localisation!.id = localisation.id;
        this.newLocalisation = new Localisation();
        this.toastr.success('Localisation ajoutée avec succès !');
      },
      error: (error) => {
        console.error('Error adding localisation:', error);
        this.toastr.error('Erreur lors de l\'ajout de la localisation');
      }
    });
  }

  addCategory() {
    this.catInfraService.create(this.newCategory).subscribe({
      next: (category) => {
        this.categories.push(category);
        this.newItem.modeleInfra!.catInfra.id = category.id;
        this.newCategory = new CategorieInfra();
        this.toastr.success('Catégorie ajoutée avec succès !');
        this.onCategoryChange(category.id);
      },
      error: (error) => {
        console.error('Error adding category:', error);
        this.toastr.error('Erreur lors de l\'ajout de la catégorie');
      }
    });
  }

  addModele() {
    if (!this.newModele.catInfra || !this.newModele.catInfra.id) {
      this.newModele.catInfra = this.categories.find(cat => cat.id === this.newModele.catInfra!.id) || { id: '', nom: '' };
    }
    if (!this.newModele.catInfra.id) {
      this.toastr.error('Veuillez sélectionner une catégorie valide.');
      return;
    }

    this.modeleInfraService.create(this.newModele).subscribe({
      next: (modele) => {
        this.filteredModeles.push(modele);
        this.newItem.modeleInfra!.id = modele.id;
        this.newModele = new ModeleInfra();
        this.newModele.catInfra = new CategorieInfra();
        this.toastr.success('Modèle ajouté avec succès !');
      },
      error: (error) => {
        console.error('Error adding modele:', error);
        this.toastr.error('Erreur lors de l\'ajout du modèle');
      }
    });
  }

  onCategoryChange(categoryId: string) {
    if (categoryId) {
      this.filteredModeles = this.allModeles.filter(m => m.catInfra.id === categoryId);
    } else {
      this.filteredModeles = [...this.allModeles];
    }

    this.newItem.modeleInfra = { id: '', nom: '', catInfra: { id: '', nom: '' } };
    this.categoryChange.emit(categoryId);
  }
}