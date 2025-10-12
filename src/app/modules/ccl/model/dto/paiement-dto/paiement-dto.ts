export class PaiementDto {
    acompteVerse!: number;
    monnaie!: number;
    reste!: number;
    modePaiement!: string;
    pdfPaiement!: string; // byte[] → string (base64)
    datePaiement!: string;

    constructor() {
        this.acompteVerse = 0;
        this.monnaie = 0;
        this.reste = 0;
        this.modePaiement = '';
        this.pdfPaiement = '';
        this.datePaiement = '';
    }
}
