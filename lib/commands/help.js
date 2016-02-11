import Command from "../models/command";
import Q from "q";

export default class Help extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Help";
  }

  static is(text) {
    let regExp = new RegExp(/.*(help).*/, "i");

    return regExp.test(text);
  }

  run() {
    let deferred = Q.defer();

    let helpList = "Commandos que soporto por ahora:\n";
    helpList += "/lista - Muestra quienes juegan \n";
    helpList += "/random - Te arma super equipos\n";
    helpList += "/equipos - Te muestra el ultimo random\n";
    helpList += "/juega - Agregas un jugador\n";
    helpList += "/baja - Le das de baja a alguien\n";
    helpList += "/help - Te muestro esta lista devuelta";

    deferred.resolve(this._buildPayload(helpList));

    return deferred.promise;
  }
}
