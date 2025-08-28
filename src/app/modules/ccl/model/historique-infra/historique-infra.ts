import {Infrastructure} from "../infrastructure/infrastructure";
import {Etat} from "../etat/etat";
import {Gestionnaire} from "../gestionnaire/gestionnaire";

export class HistoriqueInfra {
    id!: string;
    dhAction!: string;
    infrastructure!: Infrastructure;
    etat!: Etat;
    observation!: string;
    gestionnaire!: Gestionnaire;


    constructor() {
        this.gestionnaire = new Gestionnaire();
        this.etat = new Etat();
        this.infrastructure = new Infrastructure();
    }
}