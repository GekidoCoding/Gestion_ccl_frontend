import {Agent} from "../agent/agent";

export class Gestionnaire {
    public id!: string;
    public agent!: Agent;


    constructor() {
        this.agent = new Agent();
    }
}