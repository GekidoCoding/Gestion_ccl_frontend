import {Localisation} from "../localisation/localisation";
import {Etat} from "../etat/etat";
import {ModeleInfra} from "../modele-infra/modele-infra";

export class Infrastructure {
    public id!: string ;
    public numero!: string;
    public nom!: string;
    public capacite!: number;
    public modeleInfra!:ModeleInfra;
    public localisation!: Localisation;
    public elements!: string;
    public prix!: number;
    public etat!: Etat;


    constructor() {
        this.modeleInfra = new ModeleInfra();
        this.localisation = new Localisation();
        this.etat = new Etat();

    }
}