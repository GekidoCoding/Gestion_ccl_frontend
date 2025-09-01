import {Infrastructure} from "../infrastructure/infrastructure";
import {Frequence} from "../frequence/frequence";
import {ModeleInfra} from "../modele-infra/modele-infra";
import {Localisation} from "../localisation/localisation";
import {Etat} from "../etat/etat";

export class InfraTarif {
    id!:string;
    infrastructure!:Infrastructure;
    frequence!:Frequence;
    tarifInfra!:number;

    constructor() {
        this.frequence = new Frequence();
        this.infrastructure = new Infrastructure();
    }
}
