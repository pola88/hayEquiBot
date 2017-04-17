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

  afterSend(msg) {
    msg.text = "lista";
    return msg;
  }

  getNames() {
    let userNames = this._getUserName(this.payload.text);

    if(userNames) {
      this._multipleRemove(userNames);
    } else {
      return this.currentPromise.resolve(this._buildPayload("Q pones? Nadie se llama asi."));
    }
  }

  _getUserName(text) {
    let regExp = new RegExp(/baja.*? (.*)+/, "i");
    let result = regExp.exec(text);

    if (!result) {
      return this.currentPromise.resolve(this._buildPayload("Q pones? Nadie se llama asi."));
    }
    let names = _.compact(_.map(result[1].split(","), _.trim));
    if (names.length === 0) {
      return this.currentPromise.resolve(this._buildPayload("Q pones? Nadie se llama asi."));
    }

    return names;
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

  _multipleRemove(names) {
    let deferred = Q.defer();
    deferred.resolve();
    deferred = deferred.promise;
    _.each( names, name => {
      deferred = deferred.then( () => this._remove(name));
    });

    deferred.then( () => {
      let payload = this._buildPayload("");
      payload.sticker_id = "BQADAQADpgUAAkeJSwABT9f-cyPFZJQC"; // eslint-disable-line
      return this.currentPromise.resolve(payload);
    }, error => {
      console.error("Multiple Removes: ", error);
      return this.currentPromise.resolve(this._buildPayload("Algo se rompio, corre..."));
    });
  }

  _remove(user) {
    if(!user) {
      return this.currentPromise.resolve(this._buildPayload("Hay algo que esta mal! Llama al tecnico y sali corriendo."));
    }

    return Player.destroy({ where: { nickname: { $iLike: user }, chat_id: this.chatId } });
          // .then( result => {
          //   if(result === 0) {
          //     return this.currentPromise.resolve(this._buildPayload("Ya te diste de baja antes cagon!!(o nunca te sumaste)"));
          //   }
          // });
  }

  run() {
    let deferred = Q.defer();

    if(this.payload.replyFromKeyBoard) {
      this.payload.text = `baja ${this.payload.text}`;
    }

    let regExp = new RegExp(/baja.*? (.*)+/, "i");
    let withNames = regExp.test(this.payload.text);

    this.currentPromise = deferred;

    if(withNames) {
      this.getNames();
    } else {
      this.fromKeyboard();
    }

    return deferred.promise;
  }
}
