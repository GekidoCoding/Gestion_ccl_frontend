import {CategorieInfra} from "../categorie-infra/categorie-infra";

export class ModeleInfra {
    public id!: string;
    public nom!: string;
    public catInfra!: CategorieInfra;
    public couleur!:string;

    constructor() {
        this.catInfra = new CategorieInfra();
    }
}