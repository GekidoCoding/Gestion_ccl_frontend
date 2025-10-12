export class InfrastructureVisuDto {
    nom!: string;
    modele!: string;
    tarif!: number;
    frequence!: string;

    constructor() {
        this.nom = '';
        this.modele = '';
        this.tarif = 0;
        this.frequence = '';
    }
}
