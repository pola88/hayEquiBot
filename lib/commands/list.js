import Command from "../models/command";
import _ from "lodash";
import Q from "q";
import { Player, GroupConfig } from "../../models";

export default class List extends Command {

  constructor(payload) {
    super(payload);
    this._name = "List";
  }

  static is(text) {
    let regExp = new RegExp(/^(\/)?(@.*)?(quienes|lista|jugadores).*/, "i");

    return regExp.test(text);
  }
  //TODO: cuantos faltan
  run() {
    let deferred = Q.defer();

    GroupConfig.findOne({ where: { chat_id: this.chatId } })
      .then( groupConfig => {
        let numberOfPlayers = null;
        if(groupConfig) {
          numberOfPlayers = groupConfig.number_of_players;
        }

        Player.findAll({ where: { chat_id: this.chatId }, order: "created_at ASC" })
              .then( allPlayers => {
                if(_.isEmpty(allPlayers)) {
                  deferred.resolve(this._buildPayload("Todos cagones, nadie juega!!"));
                  return;
                }

                let players = allPlayers;
                if(numberOfPlayers) {
                  players = _.take(allPlayers, +numberOfPlayers);
                  let substitutePlayers = _.slice(allPlayers, +numberOfPlayers);

                  let nicknames = _.map(players, (player, index) => `${index + 1} - ${player.nickname}`);
                  let substituteNicknames = _.map(substitutePlayers, (player, index) => `s${index + 1} - ${player.nickname}`);
                  deferred.resolve(this._buildPayload(`Por ahora somos ${allPlayers.length}:\n${nicknames.join("\n")}\n-------------\n${substituteNicknames.join("\n")}` ));
                } else {
                  let nicknames = _.map(players, (player, index) => `${index + 1} - ${player.nickname}`);
                  deferred.resolve(this._buildPayload(`Por ahora somos ${players.length}:\n${nicknames.join("\n")}` ));
                }
              });
      });

    return deferred.promise;
  }
}
