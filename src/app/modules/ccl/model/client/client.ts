import {Etat} from "../etat/etat";
import {TypeClient} from "../type-client/type-client";

export class Client {
    id!: string ;
    nom!: string;
    prenom!: string;
    raisonSociale!: string;
    fonction!: string;
    email!: string;
    cin!: string;
    adresse!: string;
    contacts!: string;
    etat!: Etat;
    typeClient!: TypeClient;

    constructor() {
        this.etat = new Etat();
        this.typeClient = new TypeClient();
    }
}