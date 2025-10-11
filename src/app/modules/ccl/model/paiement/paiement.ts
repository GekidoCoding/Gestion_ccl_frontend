import {Facture} from "../facture/facture";
import {ModePaiement} from "../mode-paiement/mode-paiement";

export class Paiement {
    id!: string;
    facture!: Facture;
    modePaiement!: ModePaiement;
    datePaiement!: string;
    acompteVerse!: number;
    monnaie!:number;
    constructor() {
        this.facture = new Facture();
        this.modePaiement = new ModePaiement();
        this.datePaiement='';
        this.acompteVerse=0;
    }

}
