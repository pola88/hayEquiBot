import { List } from "../../../lib/commands";
import payload from "../../assets/payload.json";
import SpecUtil from "../../spec_utils";
import Q from "q";
import _ from "lodash";

require("jasmine-before-all");

describe("List command", () => {

  describe("is", () => {
    it("with /lista@HayEquiBot", () => {
      expect(List.is("/lista@HayEquiBot")).toBe(true);
    });

    it("with /lista", () => {
      expect(List.is("/lista")).toBe(true);
    });

    it("with @HayEquiBot juega", () => {
      expect(List.is("@HayEquiBot lista")).toBe(true);
    });
  });

  describe("Get the players for the current chat", () => {
    let listCommand;
    let currentPlayers;
    let otherPlayers;

    beforeAll( done => {
      jasmine.cleanDb( () => {
        listCommand = new List(payload);
        let chatId = payload.chat.id.toString();
        let promises = [];
        promises.push(SpecUtil.createPlayer({ chat_id: chatId }));
        promises.push(SpecUtil.createPlayer({ chat_id: chatId }));
        promises.push(SpecUtil.createPlayer({ chat_id: chatId }));
        promises.push(SpecUtil.createPlayer({ chat_id: chatId }));


        Q.all(promises)
         .then( result => {
           currentPlayers = result;
           promises = [];
           promises.push(SpecUtil.createPlayer({ chat_id: "12" }));
           promises.push(SpecUtil.createPlayer({ chat_id: "12" }));

           Q.all(promises)
            .then( secondResult => {
              otherPlayers = secondResult;
              done();
            });
         });
      });
    });

    it("returns the list", done => {
      listCommand.run()
                 .then( response => {
                   let nicknames = _.map(currentPlayers, player => player.nickname);
                   let text = response.text;

                   nicknames.forEach( nickname => {
                    expect(text).toMatch(`${nickname}`);
                   });

                   nicknames = _.map(otherPlayers, player => player.nickname);

                   nicknames.forEach( nickname => {
                    expect(text).not.toMatch(`${nickname}`);
                   });

                   done();
                 });
    });
  });
});
