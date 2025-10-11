import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModeleInfra } from '../../../model/modele-infra/modele-infra';
import { CategorieInfra } from '../../../model/categorie-infra/categorie-infra';
import { ModeleInfraService } from '../../../services/modele-infra/modele-infra.service';
import { CategorieInfraService } from '../../../services/categorie-infra/categorie-infra.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Colors} from "../../../util/colors";

@Component({
  selector: 'app-modele-infra-update-form',
  templateUrl: './modele-infra-update-form.component.html',
  styleUrls: ['./modele-infra-update-form.component.scss']
})
export class ModeleInfraUpdateFormComponent implements OnInit {
  isLoading: boolean = false;
  modeleInfra: ModeleInfra = new ModeleInfra();
  @Input() idModeleInfra:string='';
  @Output() loadData = new EventEmitter<void>();
  @ViewChild('updateForm') updateForm!: NgForm;

  catInfras: CategorieInfra[] = [];
  availableColors: string[] = [];

  constructor(
      private modeleInfraService: ModeleInfraService,
      private categorieInfraService: CategorieInfraService,
      private colorsService: Colors,
      private toastr: ToastrService,
      public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.loadModeleInfra();
    this.loadCategorieInfras();
    this.loadAvailableColors();
  }
  loadModeleInfra() {
    this.isLoading = true;
    this.modeleInfraService.getById(this.idModeleInfra).subscribe(modeleInfra => {
      this.modeleInfra = modeleInfra;
    })
  }
  loadCategorieInfras() {
    this.isLoading = true;
    this.categorieInfraService.getAll().subscribe({
      next: (catInfras) => {
        this.catInfras = catInfras;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories d\'infrastructure:', error);
        this.toastr.error('Erreur lors du chargement des catégories d\'infrastructure');
        this.isLoading = false;
      }
    });
  }

  loadAvailableColors() {
    this.isLoading = true;
    this.colorsService.getAvailableColors().subscribe({
      next: (colors) => {
        this.availableColors = colors;
        // Ajouter la couleur actuelle si elle n'est pas dans la liste disponible
        if (this.modeleInfra.couleur && !this.availableColors.includes(this.modeleInfra.couleur)) {
          this.availableColors.push(this.modeleInfra.couleur);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des couleurs disponibles:', error);
        this.toastr.error('Erreur lors du chargement des couleurs');
        this.isLoading = false;
      }
    });
  }

  submitForm() {
    this.updateForm.control.markAllAsTouched();
    if (this.updateForm.valid) {
      this.updateItem();
    }
  }

  updateItem() {
    this.isLoading = true;
    const modeleInfra: ModeleInfra = new ModeleInfra();
    modeleInfra.id = this.modeleInfra.id;
    modeleInfra.nom = this.modeleInfra.nom;
    modeleInfra.catInfra = this.catInfras.find(cat => cat.id === this.modeleInfra.catInfra!.id)!;
    modeleInfra.couleur = this.modeleInfra.couleur;

    this.modeleInfraService.update(this.modeleInfra.id, modeleInfra).subscribe({
      next: () => {
        this.toastr.success('Modèle d\'infrastructure modifié avec succès !');
        this.loadData.emit();
        this.activeModal.close();
      },
      error: (error) => {
        console.error('Erreur lors de la modification du modèle d\'infrastructure:', error);
        this.toastr.error('Erreur lors de la modification du modèle d\'infrastructure');
        this.isLoading = false;
      }
    });
  }

  cancelForm() {
    this.updateForm?.resetForm();
    this.activeModal.dismiss('Cancel');
  }
}