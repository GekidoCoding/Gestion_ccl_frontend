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
  selector: 'app-modele-infra-add-form',
  templateUrl: './modele-infra-add-form.component.html',
  styleUrls: ['./modele-infra-add-form.component.scss']
})
export class ModeleInfraAddFormComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Output() loadData = new EventEmitter<void>();
  @ViewChild('addForm') addForm!: NgForm;

  modeleInfra: ModeleInfra = new ModeleInfra();
  catInfras: CategorieInfra[] = [];
  availableColors: string[] = [];

  constructor(
      private modeleInfraService: ModeleInfraService,
      private categorieInfraService: CategorieInfraService,
      private colorsService: Colors ,
      private toastr: ToastrService,
      public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.modeleInfra.catInfra = { id: '', nom: '' };
    this.modeleInfra.couleur = '';
    this.loadCategorieInfras();
    this.loadAvailableColors();
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
      next: (colors:string[]) => {
        this.availableColors = colors;
        this.isLoading = false;
      },
      error: (error:any) => {
        console.error('Erreur lors du chargement des couleurs disponibles:', error);
        this.toastr.error('Erreur lors du chargement des couleurs');
        this.isLoading = false;
      }
    });
  }

  submitForm() {
    this.addForm.control.markAllAsTouched();
    if (this.addForm.valid) {
      this.addItem();
    }
  }

  addItem() {
    this.isLoading = true;
    const modeleInfra: ModeleInfra = new ModeleInfra();
    modeleInfra.nom = this.modeleInfra.nom;
    modeleInfra.catInfra = this.catInfras.find(cat => cat.id === this.modeleInfra.catInfra!.id)!;
    modeleInfra.couleur = this.modeleInfra.couleur;

    this.modeleInfraService.create(modeleInfra).subscribe({
      next: () => {
        this.toastr.success('Modèle d\'infrastructure ajouté avec succès !');
        this.loadData.emit();
        this.activeModal.close();
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du modèle d\'infrastructure:', error);
        this.toastr.error('Erreur lors de l\'ajout du modèle d\'infrastructure');
        this.isLoading = false;
      }
    });
  }

  cancelForm() {
    this.modeleInfra = new ModeleInfra();
    this.addForm?.resetForm();
    this.activeModal.dismiss('Cancel');
  }
}