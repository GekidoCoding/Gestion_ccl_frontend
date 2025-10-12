import {PaiementDto} from "../paiement-dto/paiement-dto";

export class HistoFactureDto {
    ref!: string;
    totalDu!: number;
    remise!: number;
    etatFacture!: string;
    matricule!: string;
    pdfProforma!: string; // byte[] => string (base64)
    paiements!: PaiementDto[];
    dhCreation!: string;

    constructor() {
        this.ref = '';
        this.totalDu = 0;
        this.remise = 0;
        this.etatFacture = '';
        this.matricule = '';
        this.pdfProforma = '';
        this.paiements = [];
        this.dhCreation = '';
    }
}
