import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FactureService } from '../../services/facture/facture.service';
import { ConfigService } from '../../services/config/config.service';
import { Facture } from '../../model/facture/facture';
import {PaiementService} from "../../services/paiement/paiement.service";

@Component({
  selector: 'app-send-email-facture',
  templateUrl: './send-email-facture.component.html',
  styleUrls: ['./send-email-facture.component.scss']
})
export class SendEmailFactureComponent implements OnInit {
  @Input() id!: string;
  @Input() mode!: string;
  recipients: string[] = [];
  newEmail: string = '';
  emailError: string | null = null;
  isLoading: boolean = false;

  facture: Facture = new Facture();

  constructor(
      public activeModal: NgbActiveModal,
      private factureService: FactureService,
      private toastr: ToastrService ,
      private paiementService:PaiementService
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  private initData(): void {
    this.isLoading = true;
    Promise.all([this.loadFacture()])
        .then(() => (this.isLoading = false))
        .catch(() => (this.isLoading = false));
  }

  private async loadFacture(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.id) return reject('ID manquant');
      if(this.mode!='paiement'){
        this.factureService.getById(this.id).subscribe({
          next: (facture) => {
            this.facture = facture;
            const clientEmail = facture?.mouvement?.client?.email;
            if (clientEmail && !this.recipients.includes(clientEmail)) {
              this.recipients.push(clientEmail);
            }
            resolve();
          },
          error: (err) => {
            console.error('Erreur lors du chargement de la facture :', err);
            this.toastr.error('Erreur lors du chargement de la facture');
            reject(err);
          }
        });
      }
      else{
        this.paiementService.getById(this.id).subscribe({
          next: (data) => {
            this.facture = data.facture;
            const clientEmail = this.facture?.mouvement?.client?.email;
            if (clientEmail && !this.recipients.includes(clientEmail)) {
              this.recipients.push(clientEmail);
            }
            resolve();
          },
          error: (err) => {
            console.error('Erreur lors du chargement de la facture :', err);
            this.toastr.error('Erreur lors du chargement de la facture');
            reject(err);
          }
        });
      }
    });
  }


  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  addEmail(): void {
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
    this.recipients.push(this.newEmail.trim());
    this.newEmail = '';
    this.emailError = null;
  }

  removeEmail(email: string): void {
    this.recipients = this.recipients.filter(e => e !== email);
  }

  sendEmail(): void {
    if (this.recipients.length === 0) {
      this.toastr.error('Veuillez ajouter au moins un destinataire.');
      return;
    }

    this.isLoading = true;
    let sendMethod  ;
    if(this.mode=='paiement'){
      console.log("paiement mode in sending email")
      sendMethod=this.factureService.sendPaiementEmail(this.id, this.recipients)
    }
    else if(this.mode=='contrat'){
      sendMethod=this.factureService.sendContratEmail(this.id, this.recipients);
    }
    else{
      sendMethod=this.factureService.sendFactureEmail(this.id, this.recipients);
    }
    sendMethod.subscribe({
      next: () => {
        this.isLoading=false;
        this.toastr.success('Email(s) envoyé(s) avec succès');
        this.activeModal.close('Email sent');
      },
      error: (error) => {
        const message = error.error?.message || 'Erreur lors de l\'envoi de l\'email';
        this.toastr.error(message);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
