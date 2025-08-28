import {Gestionnaire} from "../gestionnaire/gestionnaire";

export class Admin {
    public id!: string;
    public gestionnaire!:Gestionnaire;


    constructor() {
        this.gestionnaire = new Gestionnaire();
    }
}
