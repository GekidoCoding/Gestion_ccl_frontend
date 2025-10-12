import {InfrastructureVisuDto} from "../infrastructure-visu-dto/infrastructure-visu-dto";
import {HistoriqueMvt} from "../../historique-mvt/historique-mvt";
import {HistoFactureDto} from "../histo-facture-dto/histo-facture-dto";

export class MouvementVisualisationDto {
    client!: string;
    typeMouvement!: string;
    infrastructures!: InfrastructureVisuDto[];
    periodeDebut!: string;
    periodeFin!: string;
    nombrePersonne!: number;
    observation!: string;
    historiqueMvts!: HistoriqueMvt[];
    histoFactures!: HistoFactureDto[];

    constructor() {
        this.client = '';
        this.typeMouvement = '';
        this.infrastructures = [];
        this.periodeDebut = '';
        this.periodeFin = '';
        this.nombrePersonne = 0;
        this.observation = '';
        this.historiqueMvts = [];
        this.histoFactures = [];
    }
}
