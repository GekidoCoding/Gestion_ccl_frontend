import {Mouvement} from "../mouvement/mouvement";
import {TypeNotification} from "../type-notification/type-notification";

export class Notification {
     id!:string;
     message!: string;
     dhCreation!:string;
     read !: boolean;
     mouvement!:Mouvement;
     typeNotification:TypeNotification;

     constructor() {
          this.mouvement = new Mouvement();
          this.typeNotification = new TypeNotification();
     }

}
