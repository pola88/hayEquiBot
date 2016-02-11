import Q from "q";
import _ from "lodash";
import models from "../models";

export default class Utils {
    static teamName() {
      let len = 1;
      let charSet = "01";
      let randomString = "";
      for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
      }
      return randomString;
    }

    static randomString(len) {
      len = len || 5;
      let charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let randomString = "";
      for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
      }
      return randomString;
    }

    static createPlayer(options = {}) {
      let deferred = Q.defer();
      let chatId = new Date().getTime().toString();
      let defaultOptions = { nickname: Utils.randomString(), chat_id: chatId };

      options = _.merge(defaultOptions, options);

      models.Player.findOrCreate({ where: defaultOptions })
            .then( result => {
              deferred.resolve(result[0]);
            }, deferred.reject);

      return deferred.promise;
    }
}
