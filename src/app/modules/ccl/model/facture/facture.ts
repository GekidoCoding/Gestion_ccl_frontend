import {Gestionnaire} from "../gestionnaire/gestionnaire";
import {Etat} from "../etat/etat";
import {Mouvement} from "../mouvement/mouvement";

export class Facture {
    id!: string;
    dhCreation!: string;
    gestionnaire!: Gestionnaire | null;
    mouvement!: Mouvement;
    etat!: Etat;
    refFacture!: string;
    montantTotal!: number ;
    remise!: number;
    acompteVerse!: number;

    constructor() {
        this.gestionnaire = new Gestionnaire();
        this.mouvement = new Mouvement();
        this.etat = new Etat();
    }
}
