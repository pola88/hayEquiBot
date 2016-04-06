import { Clean } from "../../../lib/commands";
import payload from "../../assets/payload.json";
import SpecUtil from "../../spec_utils";
import Q from "q";
import { Player } from "../../../models";

require("jasmine-before-all");

describe("Clean command", () => {

  describe("is", () => {
    it("with /Clean@HayEquiBot", () => {
      expect(Clean.is("/Clean@HayEquiBot")).toBe(true);
    });

    it("with /Clean", () => {
      expect(Clean.is("/Clean")).toBe(true);
    });

    it("with @HayEquiBot Clean", () => {
      expect(Clean.is("@HayEquiBot Clean")).toBe(true);
    });

    it("with @HayEquiBot reset", () => {
      expect(Clean.is("@HayEquiBot reset")).toBe(true);
    });
  });

  describe("Get the players for the current chat", () => {
    let cleanCommand;
    beforeAll( () => {
      payload.replyFromKeyBoard = false;
      cleanCommand = new Clean(payload);
    });

    describe("first time", () => {
      it("returns the ask and the keyboard", done => {
        cleanCommand.run()
                   .then( response => {
                     let expectedKeyboard = {
                       keyboard: [ [ "si", "no" ] ],
                       one_time_keyboard: true,
                       resize_keyboard: true,
                       selective: true
                     };

                     expect(response.text).toEqual("Estas seguro?");
                     expect(response.reply_markup).toEqual(expectedKeyboard);

                     done();
                   });
      });
    });

    describe("answers 'si'", () => {
      beforeAll( done => {
        jasmine.cleanDb( () => {
          let chatId = payload.chat.id.toString();
          let promises = [];
          promises.push(SpecUtil.createPlayer({ chat_id: chatId }));
          promises.push(SpecUtil.createPlayer({ chat_id: chatId }));
          promises.push(SpecUtil.createPlayer({ chat_id: chatId }));
          promises.push(SpecUtil.createPlayer({ chat_id: chatId }));


          Q.all(promises)
           .then( () => {
             promises = [];
             promises.push(SpecUtil.createPlayer({ chat_id: "12" }));
             promises.push(SpecUtil.createPlayer({ chat_id: "12" }));

             Q.all(promises)
              .then( () => {
                done();
              });
           });
        });
      });

      it("removes all players", done => {
        cleanCommand.payload.replyFromKeyBoard = true;
        cleanCommand.payload.text = "si";
        cleanCommand.run()
                   .then( response => {
                     expect(response.text).toEqual("Todos dados de baja.");

                     let chatId = payload.chat.id.toString();
                     Player.findAll({ where: { chat_id: chatId } })
                           .then( removedPlayers => {
                             expect(removedPlayers.length).toEqual(0);

                             Player.findAll({ where: { chat_id: "12" } })
                                   .then( players => {
                                     expect(players.length).not.toEqual(0);
                                     done();
                                   });
                           });
                   });
      });
    });

    describe("answers 'no'", () => {
      beforeAll( done => {
        jasmine.cleanDb( () => {
          let chatId = payload.chat.id.toString();
          let promises = [];
          promises.push(SpecUtil.createPlayer({ chat_id: chatId }));
          promises.push(SpecUtil.createPlayer({ chat_id: chatId }));
          promises.push(SpecUtil.createPlayer({ chat_id: chatId }));
          promises.push(SpecUtil.createPlayer({ chat_id: chatId }));


          Q.all(promises)
           .then( () => {
             promises = [];
             promises.push(SpecUtil.createPlayer({ chat_id: "12" }));
             promises.push(SpecUtil.createPlayer({ chat_id: "12" }));

             Q.all(promises)
              .then( () => {
                done();
              });
           });
        });
      });

      it("does not remove all players", done => {
        cleanCommand.payload.replyFromKeyBoard = true;
        cleanCommand.payload.text = "no";
        cleanCommand.run()
                   .then( response => {
                     expect(response.text).toEqual("Sigue todo como antes.");

                     let chatId = payload.chat.id.toString();
                     Player.findAll({ where: { chat_id: chatId } })
                           .then( removedPlayers => {
                             expect(removedPlayers.length).not.toEqual(0);

                             Player.findAll({ where: { chat_id: "12" } })
                                   .then( players => {
                                     expect(players.length).not.toEqual(0);
                                     done();
                                   });
                           });
                   });
      });
    });
  });
});
