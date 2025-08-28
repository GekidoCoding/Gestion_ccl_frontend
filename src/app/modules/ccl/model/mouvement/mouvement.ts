import {Client} from "../client/client";
import {Infrastructure} from "../infrastructure/infrastructure";
import {Gestionnaire} from "../gestionnaire/gestionnaire";
import {Etat} from "../etat/etat";
import {TypeMouvement} from "../type-mouvement/type-mouvement";

export class Mouvement {
    id!: string;
    typeMouvement!: TypeMouvement;
    client!: Client;
    infrastructure!: Infrastructure;
    periodeDebut!: string;
    periodeFin!: string;
    dhMouvement!: string;
    nombre!:number;

    constructor() {
        this.typeMouvement = new TypeMouvement();
        this.client = new Client();
        this.infrastructure = new Infrastructure();
    }

}