import {Infrastructure} from "../infrastructure/infrastructure";
import {Mouvement} from "../mouvement/mouvement";
import {Frequence} from "../frequence/frequence";

export class MouvementInfra {
    public id!: string ;
    public infrastructure!: Infrastructure;
    public mouvement !:Mouvement;
    public frequence!:Frequence;
    constructor() {
        this.infrastructure = new Infrastructure();
        this.frequence = new Frequence();
        this.mouvement=new Mouvement();

    }
}
