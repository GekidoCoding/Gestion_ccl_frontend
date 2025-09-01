import {Infrastructure} from "../infrastructure/infrastructure";
import {Mouvement} from "../mouvement/mouvement";

export class MouvementInfra {
    public id!: string ;
    public infrastructure!: Infrastructure;
    public mouvement !:Mouvement;

    constructor() {
        this.infrastructure = new Infrastructure();
        this.mouvement=new Mouvement();
    }
}
