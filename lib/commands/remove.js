import Command from "../models/command";
import Q from "q";
import { Player } from "../../models";

export default class Remove extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Remove";
    this._currentPromise = null;
  }

  static is(text) {
    let regExp = new RegExp(/.*(baja).*/, "i");

    return regExp.test(text);
  }

  _getUserName(text) {
    let regExp = new RegExp(/baja (.*)+/, "i");
    let userName = regExp.exec(text);

    if(!userName) {
      return this.currentPromise.resolve(this._buildPayload("Q pones? Nadie se llama asi."));
    }

    return userName[1];
  }

  another() {
    let userName = this._getUserName(this.payload.text);

    if(userName) {
      this._remove(userName);
    } else {
      return this.currentPromise.resolve(this._buildPayload("Q pones? Nadie se llama asi."));
    }
  }

  me() {
    this._remove(this.payload.user);
  }

  _remove(user) {
    if(!user) {
      return this.currentPromise.resolve(this._buildPayload("Hay algo que esta mal! Llama al tecnico y sali corriendo."));
    }

    Player.destroy({ where: { nickname: user.toLowerCase(), chat_id: this.chatId } })
          .then( result => {
            if(result === 0) {
              return this.currentPromise.resolve(this._buildPayload("Ya te diste de baja antes cagon!!(o nunca te sumaste)"));
            }

            let payload = this._buildPayload("");
            payload.sticker_id = "BQADAQADpgUAAkeJSwABT9f-cyPFZJQC"; // eslint-disable-line
            return this.currentPromise.resolve(payload);
          });
  }

  run() {
    let deferred = Q.defer();

    // let regExp = new RegExp(/.*(baja .*).*/, "i");
    // let anotherPlayer = regExp.test(this.payload.text);

    this.currentPromise = deferred;

    // if(anotherPlayer) {
    this.another();
    // } else {
    //   this.me();
    // }

    return deferred.promise;
  }
}
