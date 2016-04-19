import Command from "../models/command";
import Q from "q";
import { GroupConfig } from "../../models";

export default class Limit extends Command {
  constructor(payload) {
    super(payload);
    this._name = "Limit";
  }

  static is(text) {
    let regExp = new RegExp(/^(\/)?(@.*)?(somos).*/, "i");

    return regExp.test(text);
  }

  updateConfLimit(number) {
    if(number.toString() === "") {
      return this.currentPromise.resolve(this._buildPayload("Tenes que poner un numero."));
    } else {
      GroupConfig.findOrCreate({ where: { chat_id: this.chatId } })
                 .then( groupConfig => {
                   groupConfig = groupConfig[0];
                   groupConfig.number_of_players = +number;
                   groupConfig.save()
                              .then( () => {
                                return this.currentPromise.resolve(this._buildPayload(`Ahora solo pueden jugar ${number} jugadores, los otros son suplentes.`));
                              });
                 });
    }
  }

  run() {
    let deferred = Q.defer();

    let regExp = new RegExp(/somos.*? (\d*)+/, "i");
    let number = regExp.exec(this.payload.text);
    number = number[1];

    this.currentPromise = deferred;
    this.updateConfLimit(number);

    return deferred.promise;
  }
}
