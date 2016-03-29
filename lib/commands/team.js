import Command from "../models/command";
import _ from "lodash";
import Q from "q";
import { Player } from "../../models";

export default class Teams extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Teams";
  }

  static is(text) {
    let regExp = new RegExp(/^(\/)?(@.*)?(equipos).*/, "i");

    return regExp.test(text);
  }

  run() {
    let deferred = Q.defer();

    Player.findWithTeam(this.chatId)
          .then( players => {
              if(_.isEmpty(players)) {
                deferred.resolve(this._buildPayload("No hay ningun equipo todavia."));
                return;
              }

              let teamA = [];
              let teamB = [];

              _.each(players, player => {
                if(player.team === "0") {
                  teamA.push(player.nickname);
                } else {
                  teamB.push(player.nickname);
                }
              });

              deferred.resolve(this._buildPayload(`<b>Equipo 1:</b>${teamA.join(", ")}\n<b>Equipo 2:</b>${teamB.join(", ")}` ));
    });


    return deferred.promise;
  }
}
