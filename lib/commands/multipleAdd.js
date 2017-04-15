import Command from "../models/command";
import Q from "q";
import { Player, GroupConfig } from "../../models";
import _ from "lodash";

export default class Add extends Command {

  constructor(payload) {
    super(payload);
    this._name = "MultipleAdd";
  }

  static is(text) {
    let regExp = new RegExp(/^(\/)?(@.*)?(juego|juega).*/, "i");

    return regExp.test(text);
  }

  getNames() {
    let names = this._getUserName(this.payload.text);
    if(names) {
      this._multipleInsert(names);
    } else {
      return this.currentPromise.resolve(this._buildPayload("Te falto el nombre ameo!"));
    }
  }

  me() {
    let username = this.payload.from.username;

    if(username) {
      this._multipleInsert([username]);
    } else {
      return this.currentPromise.resolve(this._buildPayload("Necesitas un nickname para esta funcion."));
    }
  }

  _getUserName(text) {
    let regExp = new RegExp(/juega.*? (.*)+/, "i");
    let result = regExp.exec(text);

    if (!result) {
      return this.currentPromise.resolve(this._buildPayload("Quien?? quien juega?? Ah no, no pusiste ningun nombre."));
    }
    let names = _.compact(_.map(result[1].split(","), _.trim));
    if (names.length === 0) {
      return this.currentPromise.resolve(this._buildPayload("Quien?? quien juega?? Ah no, no pusiste ningun nombre."));
    }

    return names;
  }

  _multipleInsert(names) {
    let deferred = Q.defer();
    deferred.resolve();
    deferred = deferred.promise;
    _.each( names, name => {
      deferred = deferred.then( () => this._insert(name));
    });

    deferred.then( () => {
      Player.findAll({ where: { chat_id: this.chatId }, order: "created_at ASC" })
        .then( allPlayers => {

          GroupConfig.findOne({ where: { chat_id: this.chatId } })
            .then( groupConfig => {
              let numberOfPlayers = null;
              if(groupConfig) {
                numberOfPlayers = groupConfig.number_of_players;
              }

              let players = allPlayers;
              if(numberOfPlayers) {
                players = _.take(allPlayers, +numberOfPlayers);
                let substitutePlayers = _.slice(allPlayers, +numberOfPlayers);

                let nicknames = _.map(players, player => player.nickname);
                let substituteNicknames = _.map(substitutePlayers, player => player.nickname);
                this.currentPromise.resolve(this._buildPayload(`Que viva el futbol!!\nAhora somos ${allPlayers.length}:\n${nicknames.join("\n")}\n-------------\n${substituteNicknames.join("\n")}` ));
              } else {
                let nicknames = _.map(players, player => player.nickname);
                this.currentPromise.resolve(this._buildPayload(`Que viva el futbol!!\nAhora somos ${players.length}:\n${nicknames.join("\n")}` ));
              }
            });
        });
    }, error => {
      console.error("Multiple Inserts: ", error);
      return this.currentPromise.resolve(this._buildPayload("Algo se rompio, corre..."));
    });
  }

  _insert(user) {
    let deferred = Q.defer();

    if(!user) {
      return deferred.reject("No hay nombre!!");
    }

    Player.findOrCreate( { where: { nickname: user, chat_id: this.chatId } })
          .then( () => {
            deferred.resolve();
          }, deferred.reject);

    return deferred.promise;
  }

  run() {
    let deferred = Q.defer();

    let regExp = new RegExp(/.*(juega).*/, "i");
    let withNames = regExp.test(this.payload.text);

    this.currentPromise = deferred;
    if(withNames) {
      this.getNames();
    } else {
      this.me();
    }

    return deferred.promise;
  }

}
