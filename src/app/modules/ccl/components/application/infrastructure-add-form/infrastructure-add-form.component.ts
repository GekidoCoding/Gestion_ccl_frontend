import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Infrastructure } from '../../../model/infrastructure/infrastructure';
import { Localisation } from '../../../model/localisation/localisation';
import { Etat } from '../../../model/etat/etat';
import { CategorieInfra } from '../../../model/categorie-infra/categorie-infra';
import { ModeleInfra } from '../../../model/modele-infra/modele-infra';
import { LocalisationService } from '../../../services/localisation/localisation.service';
import { CategorieInfraService } from '../../../services/categorie-infra/categorie-infra.service';
import { ModeleInfraService } from '../../../services/modele-infra/modele-infra.service';

@Component({
  selector: 'app-infrastructure-add-form',
  templateUrl: './infrastructure-add-form.component.html',
  styleUrls: ['./infrastructure-add-form.component.scss']
})
export class InfrastructureAddFormComponent {
  @Input() newItem: Partial<Infrastructure> = new Infrastructure();
  @Input() localisations: Localisation[] = [];
  @Input() etats: Etat[] = [];
  @Input() categories: CategorieInfra[] = [];
  @Input() filteredModeles: ModeleInfra[] = [];
  @Output() submitForm = new EventEmitter<Infrastructure>();
  @Output() cancel = new EventEmitter<void>();
  @Output() categoryChange = new EventEmitter<string>();
  newLocalisation: Localisation = new Localisation();
  newCategory: CategorieInfra = new CategorieInfra();
  newModele: ModeleInfra = new ModeleInfra();


  constructor(
      private modalService: NgbModal,
      private localisationService: LocalisationService,
      private catInfraService: CategorieInfraService,
      private modeleInfraService: ModeleInfraService,
      private toastr: ToastrService
  ) {
    this.newModele.catInfra = new CategorieInfra();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const obj: Infrastructure = new Infrastructure();
      obj.nom = this.newItem.nom!;
      obj.numero = this.newItem.numero!;
      obj.capacite = this.newItem.capacite!;
      obj.localisation = this.localisations.find(loc => loc.id === this.newItem.localisation!.id)!;
      obj.elements = this.newItem.elements!;
      obj.prix = this.newItem.prix!;
      obj.etat = this.etats.find(et => et.id === this.newItem.etat!.id)!;
      obj.modeleInfra = this.filteredModeles.find(m => m.id === this.newItem.modeleInfra!.id)!;
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
    this.categoryChange.emit(categoryId);
  }
}