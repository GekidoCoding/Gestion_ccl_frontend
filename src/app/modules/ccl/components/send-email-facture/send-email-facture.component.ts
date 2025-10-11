import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { FactureService } from '../../services/facture/facture.service';

@Component({
  selector: 'app-send-email-facture',
  templateUrl: './send-email-facture.component.html',
  styleUrls: ['./send-email-facture.component.scss']
})
export class SendEmailFactureComponent implements OnInit {
  @Input() idFacture!: string;
  recipients: string[] = [];
  newEmail: string = '';
  emailError: string | null = null;
  isLoading: boolean = false;

  constructor(
      public activeModal: NgbActiveModal,
      private http: HttpClient,
      private factureService: FactureService,
      private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFactureEmail();
  }

  loadFactureEmail() {
    if (this.idFacture) {
      this.factureService.getById(this.idFacture).subscribe({
        next: (facture) => {
          if (facture?.mouvement?.client?.email) {
            this.recipients.push(facture.mouvement.client.email);
          }
        },
        error: (error) => {
          console.error('Error loading facture:', error);
          this.toastr.error('Erreur lors du chargement des données de la facture');
        }
      });
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  addEmail() {
    if (!this.newEmail) {
      this.emailError = 'Veuillez entrer un email.';
      return;
    }
    if (!this.validateEmail(this.newEmail)) {
      this.emailError = 'Veuillez entrer un email valide.';
      return;
    }
    if (this.recipients.includes(this.newEmail)) {
      this.emailError = 'Cet email est déjà dans la liste.';
      return;
    }
    this.recipients.push(this.newEmail);
    this.newEmail = '';
    this.emailError = null;
  }

  removeEmail(email: string) {
    this.recipients = this.recipients.filter(recipient => recipient !== email);
  }

  sendEmail() {
    if (this.recipients.length === 0) {
      this.toastr.error('Veuillez ajouter au moins un destinataire.');
      return;
    }

    this.isLoading = true;

    this.factureService.sendFactureEmail(this.idFacture, this.recipients).subscribe({
      next: (response: string) => {
        this.toastr.success('Email(s) envoyé(s) avec succès');
        this.activeModal.close('Email sent');
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        const message = error.error?.message || 'Erreur lors de l\'envoi de l\'email';
        this.toastr.error(message);
      },
      complete: () => {
        this.isLoading = false;
        this.activeModal.close('Email sent');
      }
    });
  }
}
