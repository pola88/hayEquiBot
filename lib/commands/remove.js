import Command from "../models/command";
import Q from "q";
import { Player } from "../../models";
import _ from "lodash";

export default class Remove extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Remove";
    this._currentPromise = null;
  }

  static is(text) {
    let regExp = new RegExp(/^(\/)?(@.*)?(baja).*/, "i");

    return regExp.test(text);
  }

  static replyFromKeyBoard(payload) {
    if(payload.reply_to_message.text === "Quien se baja?") {
      return true;
    } else {
      return false;
    }
  }

  _getUserName(text) {
    let regExp = new RegExp(/baja.*? (.*)+/, "i");
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

  fromKeyboard() {
    Player.findAll({ where: { chat_id: this.chatId } })
          .then( result => {
            if(result.length !== 0) {
              let payload = this._buildPayload("Quien se baja?");
              let keyboardOptions = _.map(result, player => player.nickname);

              payload.reply_markup = {
                keyboard: _.chunk(keyboardOptions, 2),
                one_time_keyboard: true,
                resize_keyboard: true,
                selective: true
              };

              return this.currentPromise.resolve(payload);
            } else {
              return this.currentPromise.resolve(this._buildPayload("mm! Nadie juega!"));
            }
          });
  }

  _remove(user) {
    if(!user) {
      return this.currentPromise.resolve(this._buildPayload("Hay algo que esta mal! Llama al tecnico y sali corriendo."));
    }

    Player.destroy({ where: { nickname: { $iLike: user }, chat_id: this.chatId } })
          .then( result => {
            if(result === 0) {
              return this.currentPromise.resolve(this._buildPayload("Ya te diste de baja antes cagon!!(o nunca te sumaste)"));
            }

            let payload = this._buildPayload("");
            payload.sticker_id = "BQADAQADpgUAAkeJSwABT9f-cyPFZJQC"; // eslint-disable-line
            if (!this.payload.replyFromKeyBoard) {
              return this.currentPromise.resolve(payload);
            } else {
              return false;
            }
          });
  }

  run() {
    let deferred = Q.defer();

    if(this.payload.replyFromKeyBoard) {
      this.payload.text = `baja ${this.payload.text}`;
    }

    let regExp = new RegExp(/baja.*? (.*)+/, "i");
    let anotherPlayer = regExp.test(this.payload.text);

    this.currentPromise = deferred;

    if(anotherPlayer) {
      this.another();
    } else {
      this.fromKeyboard();
    }

    return deferred.promise;
  }
}
