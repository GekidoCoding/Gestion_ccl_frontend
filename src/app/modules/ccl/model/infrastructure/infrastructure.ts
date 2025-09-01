import {Localisation} from "../localisation/localisation";
import {Etat} from "../etat/etat";
import {ModeleInfra} from "../modele-infra/modele-infra";
import {MouvementInfra} from "../mouvement-infra/mouvement-infra";
import {InfraTarif} from "../infra-tarif/infra-tarif";

export class Infrastructure {
    public id!: string ;
    public numero!: string;
    public nom!: string;
    public capacite!: number;
    public modeleInfra!:ModeleInfra;
    public localisation!: Localisation;
    public elements!: string;
    public etat!: Etat;
    public infraTarifs!: InfraTarif[];

    constructor() {
        this.modeleInfra = new ModeleInfra();
        this.localisation = new Localisation();
        this.etat = new Etat();
        this.infraTarifs = [];
    }
}