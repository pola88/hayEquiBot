import Command from "../models/command";
import Q from "q";
import { Player } from "../../models";

export default class Add extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Add";
  }

  static is(text) {
    let regExp = new RegExp(/.*(juego|juega).*/, "i");

    return regExp.test(text);
  }

  another() {
    let userName = this._getUserName(this.payload.text);
    if(userName) {
      this._insert(userName);
    } else {
      return this.currentPromise.resolve(this._buildPayload("Te falto el nombre ameo!"));
    }
  }

  _getUserName(text) {
    let regExp = new RegExp(/juega.*? (.*)+/, "i");
    let userName = regExp.exec(text);

    if(!userName) {
      return this.currentPromise.resolve(this._buildPayload("Quien?? quien juega?? Ah no, no pusiste ningun nombre."));
    }

    return userName[1];
  }

  me() {
    // let telegramId = this.payload.from.id;
    //
    // this._insert(telegramId);
    return this.currentPromise.resolve(this._buildPayload("No No No! ese comando no existe!"));
  }

  _insert(user) {
    if(!user) {
      return this.currentPromise.resolve(this._buildPayload("Hay algo que esta mal! Llama al tecnico y sali corriendo."));
    }

    Player.findOrCreate( { where: { nickname: user, chat_id: this.chatId } })
          .then( result => {
            let created = result[1];

            if(created) {
              return this.currentPromise.resolve(this._buildPayload("Que viva el futbol!!"));
            } else {
              return this.currentPromise.resolve(this._buildPayload("Ya estas anotado pibe, gracias que podes \"correr\" y queres jugar por 2?"));
            }
          }, () => {
            return this.currentPromise.resolve(this._buildPayload("Ya estas anotado pibe, gracias que podes \"correr\" y queres jugar por 2?"));
          });
  }

  run() {
    let deferred = Q.defer();

    let regExp = new RegExp(/.*(juega).*/, "i");
    let anotherPlayer = regExp.test(this.payload.text);

    this.currentPromise = deferred;

    if(anotherPlayer) {
      this.another();
    } else {
      this.me();
    }

    return deferred.promise;
  }

}
