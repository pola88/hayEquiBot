import Command from "../models/command";
import _ from "lodash";
import Q from "q";
import { Player } from "../../models";

export default class List extends Command {

  constructor(payload) {
    super(payload);
    this._name = "List";
  }

  static is(text) {
    let regExp = new RegExp(/^(\/)?(@.*)?(quienes|lista|jugadores).*/, "i");

    return regExp.test(text);
  }

  run() {
    let deferred = Q.defer();

    Player.findAll({ where: { chat_id: this.chatId }, order: "created_at ASC" })
          .then( players => {
            if(_.isEmpty(players)) {
              deferred.resolve(this._buildPayload("Todos cagones, nadie juega!!"));
              return;
            }

            let nicknames = _.map(players, player => player.nickname);
            deferred.resolve(this._buildPayload(`Por ahora somos ${players.length}:\n${nicknames.join("\n")}` ));
          });

    return deferred.promise;
  }
}
