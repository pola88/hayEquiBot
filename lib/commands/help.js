import Command from "../models/command";
import Q from "q";

export default class Help extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Help";
  }

  static is(text) {
    let regExp = new RegExp(/^(\/)?(@.*)?(help).*/, "i");

    return regExp.test(text);
  }

  run() {
    let deferred = Q.defer();

    let helpList = "Commandos que soporto por ahora:\n";
    helpList += "/lista - Muestra quienes juegan \n";
    helpList += "/random - Te arma super equipos\n";
    helpList += "/equipos - Te muestra el ultimo random\n";
    helpList += "/juega {nombre} - Agregas un jugador\n";
    helpList += "/juego - Te agregas a vos mismo, si tenes nickname\n";
    helpList += "/baja {nombre} - Le das de baja a alguien\n";
    helpList += "/baja - (Sin nombre) Seleccionas uno de la lista\n";
    helpList += "/help - Te muestro esta lista devuelta";

    deferred.resolve(this._buildPayload(helpList));

    return deferred.promise;
  }
}
