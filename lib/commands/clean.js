import Command from "../models/command";
import Q from "q";
import { Player } from "../../models";

export default class Clean extends Command {
  constructor(payload) {
    super(payload);
    this._name = "Clean";
  }

  static is(text) {
    let regExp = new RegExp(/^(\/)?(@.*)?(clean|reset).*/, "i");

    return regExp.test(text);
  }

  static replyFromKeyBoard(payload) {
    if(payload.reply_to_message.text === "Estas seguro?") {
      return true;
    } else {
      return false;
    }
  }

  run() {
    let deferred = Q.defer();

    if(this.payload.replyFromKeyBoard) {
      if(this.payload.text === "si") {
        Player.destroy( { where: { chat_id: this.chatId } })
              .then( () => {
                deferred.resolve(this._buildPayload("Todos dados de baja."));
              });
      } else {
        deferred.resolve(this._buildPayload("Sigue todo como antes."));
      }
    } else {
      let payload = this._buildPayload("Estas seguro?");

      payload.reply_markup = {
        keyboard: [ ["si", "no"] ],
        one_time_keyboard: true,
        resize_keyboard: true,
        selective: true
      };

      deferred.resolve(payload);
    }

    return deferred.promise;
  }
}
