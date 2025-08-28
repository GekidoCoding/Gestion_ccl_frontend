import {Facture} from "../facture/facture";
import {Etat} from "../etat/etat";
import {Gestionnaire} from "../gestionnaire/gestionnaire";

export class HistoFacture {
    id!: string;
    facture!: Facture;
    etat!: Etat;
    dhAction!: string;
    refFacture!: string;
    montant!: number;
    gestionnaire!: Gestionnaire;


    constructor() {
        this.gestionnaire = new Gestionnaire();
        this.etat = new Etat();
        this.facture = new Facture();
    }
}