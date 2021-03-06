import Command from "../models/command";
import _ from "lodash";
import Q from "q";
import { Player, GroupConfig } from "../../models";

export default class Random extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Random";
  }

  static is(text) {
    let regExp = new RegExp(/^(\/)?(@.*)?(random).*/, "i");

    return regExp.test(text);
  }

  run() {
    let deferred = Q.defer();
    GroupConfig.findOne({ where: { chat_id: this.chatId } })
      .then( groupConfig => {
        let numberOfPlayers = null;
        if(groupConfig) {
          numberOfPlayers = groupConfig.number_of_players;
        }

        Player.findAll({ where: { chat_id: this.chatId }, limit: numberOfPlayers, order: "created_at ASC" })
              .then( players => {
                // numberOfPlayers = numberOfPlayers || -1;
                if(_.isEmpty(players)) {
                  deferred.resolve(this._buildPayload("Todos cagones, nadie juega!!"));
                  return;
                }
                // else if(players.length < numberOfPlayers && numberOfPlayers !== -1) {
                //   deferred.resolve(this._buildPayload("Con la cantidad que son, jueguen al Fifa en la play, no molesten."));
                //   return;
                // }

                let items = _.shuffle(players);

                let teamA = [];
                let teamB = [];
                let promises = [];

                items.forEach( (player, index) => {
                  if(index % 2 === 0) {
                    player.team = 0;
                    teamA.push(player.nickname);
                  } else {
                    player.team = 1;
                    teamB.push(player.nickname);
                  }

                  promises.push(player.save());
                });

                Q.all(promises)
                 .then( () => {
                    deferred.resolve(this._buildPayload(`<b>Equipo 1 (⚪️):</b>${teamA.join(", ")}\n<b>Equipo 2 (⚫️):</b>${teamB.join(", ")}` ));
                 }, () => {
                   deferred.resolve(this._buildPayload("Hay algo que esta mal! Llama al tecnico y sali corriendo."));
                 });

              });
    });

    return deferred.promise;
  }
}
