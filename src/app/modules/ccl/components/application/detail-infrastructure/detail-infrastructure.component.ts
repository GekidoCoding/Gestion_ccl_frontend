import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
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
import {Router} from "@angular/router";
import {MouvementAddComponent} from "../mouvement-add/mouvement-add.component";

@Component({
  selector: 'app-detail-infrastructure',
  templateUrl: './detail-infrastructure.component.html',
  styleUrls: ['./detail-infrastructure.component.scss']
})
export class DetailInfrastructureComponent implements OnInit {
  @Input() infrastructureId!: string;
  selectedItem: Infrastructure | null = null;
  localisations: Localisation[] = [];
  etats: Etat[] = [];
  categories: CategorieInfra[] = [];
  modeles: ModeleInfra[] = [];
  filteredModeles: ModeleInfra[] = [];
  newLocalisation: Localisation = new Localisation();
  newModele: ModeleInfra = new ModeleInfra();
  newCategory: CategorieInfra = new CategorieInfra();
  isEditing = false;
  isLoading = true;
  @Output() loadData = new EventEmitter<void>();


  constructor(
      public activeModal: NgbActiveModal,
      private router: Router,
      private modalService: NgbModal, // Added NgbModal
      private service: InfrastructureService,
      private localisationService: LocalisationService,
      private etatService: EtatService,
      private modeleInfraService: ModeleInfraService,
      private catInfraService: CategorieInfraService,
      private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadLocalisations();
    this.loadEtats();
    this.loadCategories();
    this.loadModeles();
    this.loadInfrastructure();
  }

  loadInfrastructure() {
    if (this.infrastructureId) {
      this.service.getById(this.infrastructureId).subscribe({
        next: (data) => {
          this.selectedItem = { ...data, localisation: { ...data.localisation }, etat: { ...data.etat }, modeleInfra: { ...data.modeleInfra } };
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading infrastructure details:', error);
          this.toastr.error('Erreur lors du chargement des détails de l\'infrastructure');
          this.isLoading = false;
        }
      });
    }
  }

  loadLocalisations() {
    this.localisationService.getAll().subscribe({
      next: (localisations) => this.localisations = localisations,
      error: (error) => {
        console.error('Error loading localisations:', error);
        this.toastr.error('Erreur lors du chargement des localisations');
      }
    });
  }

  loadEtats() {
    this.etatService.getAll().subscribe({
      next: (etats) => this.etats = etats,
      error: (error) => {
        console.error('Error loading etats:', error);
        this.toastr.error('Erreur lors du chargement des états');
      }
    });
  }

  loadCategories() {
    this.catInfraService.getAll().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('Erreur lors du chargement des catégories');
      }
    });
  }

  loadModeles() {
    this.modeleInfraService.getAll().subscribe({
      next: (modeles) => {
        this.modeles = modeles;
        this.filteredModeles = [...modeles];
      },
      error: (error) => {
        console.error('Error loading modeles:', error);
        this.toastr.error('Erreur lors du chargement des modèles');
      }
    });
  }

  openLocalisationModal(content: any) {
    const options:NgbModalOptions = { size: 'sm', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  openCategoryModal(content: any) {
    const options:NgbModalOptions = { size: 'sm', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  openModeleModal(content: any) {
    const options:NgbModalOptions = { size: 'sm', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }

  addLocalisation() {
    this.localisationService.create(this.newLocalisation).subscribe({
      next: (localisation) => {
        this.localisations.push(localisation);
        if (this.selectedItem) this.selectedItem.localisation!.id = localisation.id;
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
        if (this.selectedItem) this.selectedItem.modeleInfra!.catInfra.id = category.id;
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
        this.modeles.push(modele);
        this.filteredModeles = [...this.modeles];
        if (this.selectedItem) this.selectedItem.modeleInfra!.id = modele.id;
        this.newModele = new ModeleInfra();
        this.newModele.catInfra = { id: '', nom: '' };
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
      this.filteredModeles = this.modeles.filter(m => m.catInfra.id === categoryId);
    } else {
      this.filteredModeles = [...this.modeles];
    }
    if (this.selectedItem) this.selectedItem.modeleInfra = { id: '', nom: '', catInfra: { id: '', nom: '' } };
  }

  toggleEditMode() {
    this.isEditing = true;
  }

  cancelEdit() {
    if (this.selectedItem) {
      this.service.getById(this.selectedItem.id).subscribe({
        next: (data) => {
          this.selectedItem = { ...data, localisation: { ...data.localisation }, etat: { ...data.etat }, modeleInfra: { ...data.modeleInfra } };
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Error reloading infrastructure details:', error);
          this.toastr.error('Erreur lors du rechargement des détails');
        }
      });
    }
  }

  update() {
    if (this.selectedItem) {
      this.service.update(this.selectedItem.id, this.selectedItem).subscribe({
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

  navigateToMovements(id: string ) {
    this.modalService.dismissAll();
    this.router.navigate([`/general/mouvement/infrastructure/${id}`]);
  }

  openMovementModal(content: any) {
    const options:NgbModalOptions = { size: 'lg', centered: true, backdrop: 'static' };
    this.modalService.open(content, options);
  }
  addMouvementInfra(){
      const options:NgbModalOptions = {size:'lg' , centered:true , backdrop:'static'};
      const component  = this.modalService.open(MouvementAddComponent , options) ;
      component.componentInstance.infrastructure=this.selectedItem;
      component.componentInstance.newItem.infrastructure = this.selectedItem;
  }
}