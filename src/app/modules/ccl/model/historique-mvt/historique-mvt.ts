import {Gestionnaire} from "../gestionnaire/gestionnaire";
import {Mouvement} from "../mouvement/mouvement";
import {TypeMouvement} from "../type-mouvement/type-mouvement";

export class HistoriqueMvt {
    id!: string;
    dhAction!:string;
    gestionnaire!: Gestionnaire;
    mouvement!: Mouvement;
    typeMouvement!: TypeMouvement;


    constructor() {
        this.gestionnaire = new Gestionnaire();
        this.mouvement = new Mouvement();
        this.typeMouvement = new TypeMouvement();
    }
}