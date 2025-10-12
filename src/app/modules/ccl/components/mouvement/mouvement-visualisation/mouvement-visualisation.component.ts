import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MouvementVisualisationDto } from "../../../model/dto/mouvement-visualisation-dto/mouvement-visualisation-dto";
import { MouvementService } from "../../../services/mouvement/mouvement.service";
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-mouvement-visualisation',
  templateUrl: './mouvement-visualisation.component.html',
  styleUrls: ['./mouvement-visualisation.component.scss']
})
export class MouvementVisualisationComponent implements OnInit {
  @Input() mouvementId!: string;
  isLoading = false;
  mouvement: MouvementVisualisationDto = new MouvementVisualisationDto();

  @ViewChild('captureZone') captureZone!: ElementRef;

  constructor(
      private mouvementService: MouvementService,
      private toastr: ToastrService,
      public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.loadMouvementData();
  }

  loadMouvementData(): void {
    if (this.mouvementId) {
      this.isLoading = true;
      this.mouvementService.getVisualisation(this.mouvementId).subscribe({
        next: (data: MouvementVisualisationDto) => {
          this.mouvement = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des détails du mouvement:', error);
          this.toastr.error('Erreur lors du chargement des détails du mouvement');
          this.isLoading = false;
        }
      });
    }
  }

  closeModal(): void {
    this.activeModal.dismiss('Close click');
  }

  captureModal(): void {
    if (!this.captureZone) {
      this.toastr.error('Zone de capture introuvable');
      return;
    }

    html2canvas(this.captureZone.nativeElement, {
      scale: 2,
      useCORS: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = imgData;
      link.download = `mouvement-${this.mouvementId}.png`;
      link.click();

      this.toastr.success('Capture enregistrée avec succès');
    }).catch(err => {
      console.error(err);
      this.toastr.error('Erreur lors de la capture du composant');
    });
  }
}
