import { Injectable } from '@angular/core';
import { Client } from '../model/client/client';
import { ClientService } from '../services/client/client.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YesNoWarningComponent } from '../components/yes-no-warning/yes-no-warning.component';

@Injectable({
    providedIn: 'root'
})
export class ClientUtil {
    constructor(
        private service: ClientService,
        private toastr: ToastrService,
        private modalService: NgbModal
    ) {}

    addAction(client: Client, afterCreate?: () => void) {
        this.service.checkSimilarity(client).subscribe({
            next: (clients: Client[]) => {
                if (clients.length > 0) {
                    const message: string = ClientUtil.getWarningMessageSimilarityFromList(clients);
                    const composant = this.modalService.open(YesNoWarningComponent);
                    composant.componentInstance.message = message;
                    composant.componentInstance.confirm.subscribe({
                        next: () => {
                            this.service.create(client).subscribe({
                                next: (created) => {
                                    this.toastr.success('Client ajouté avec succès !');
                                    if(afterCreate){afterCreate();}
                                },
                                error: (error) => {
                                    console.error('Erreur lors de l\'ajout du client', error);
                                    this.toastr.error('Erreur lors de l\'ajout du client');
                                }
                            });

                        }
                    });
                    composant.componentInstance.decline.subscribe({
                        next: () => {
                            composant.close();
                        }
                    });
                } else {
                    this.service.create(client).subscribe({
                        next: (created) => {
                            this.toastr.success('Client ajouté avec succès !');
                            if(afterCreate){afterCreate();}
                        },
                        error: (error) => {
                            console.error('Erreur lors de l\'ajout du client', error);
                            this.toastr.error('Erreur lors de l\'ajout du client');
                        }
                    });
                }
            },
            error: (error) => {
                console.error('Erreur lors de la vérification de similarité:', error);
                this.toastr.error('Erreur lors de la vérification de similarité');
            }
        });
    }

    static getWarningMessageSimilarityFromList(list: Client[]): string {
        if (!list || list.length === 0) return '';
        const details = list.map(i => `- ${i.designationClient+' '+i.contacts || '(inconnu)'}`).join('\n');
        return `Des Clients similaires( nom ou contacts ) existent déjà :\n${details}\n\nVoulez-vous quand même créer celle-ci ?`;
    }
}