import { Remove } from "../../../lib/commands";
import { Player } from "../../../models";
import payload from "../../assets/payload.json";
import SpecUtil from "../../spec_utils";

require("jasmine-before-all");

describe("Remove command", () => {
  let removeCommand;
  let chatId;

  beforeAll( done => {
    chatId = payload.chat.id.toString();
    payload.replyFromKeyBoard = false;
    jasmine.cleanDb(done);
  });

  describe("is", () => {
    it("with /baja@HayEquiBot", () => {
      expect(Remove.is("/baja@HayEquiBot")).toBe(true);
    });

    it("with /baja", () => {
      expect(Remove.is("/baja")).toBe(true);
    });

    it("with @HayEquiBot baja", () => {
      expect(Remove.is("@HayEquiBot baja")).toBe(true);
    });
  });

  describe("valid nickname", () => {

    describe("with /baja@HayEquiBot", () => {
      let response;
      let player;

      beforeAll( done => {
        SpecUtil.createPlayer({ chat_id: chatId })
                .then( newPlayer => {
                  player = newPlayer;

                  payload.text = `/baja@HayEquiBot ${player.nickname}`;
                  removeCommand = new Remove(payload);
                  removeCommand.run()
                               .then( result => {
                                 response = result;
                                 done();
                               });
                });
      });

      it("removes the player", done => {
        Player.findById(player.id)
              .then( result => {
                expect(result).toBeBlank();
                done();
              });
      });

      it("returns the stickerId", () => {
        expect(response.sticker_id).toEqual("BQADAQADpgUAAkeJSwABT9f-cyPFZJQC");
      });
    });

    describe("with /baja", () => {
      let response;
      let player;

      beforeAll( done => {
        SpecUtil.createPlayer({ chat_id: chatId })
                .then( newPlayer => {
                  player = newPlayer;

                  payload.text = `/baja ${player.nickname}`;
                  removeCommand = new Remove(payload);

                  removeCommand.run()
                               .then( result => {
                                 response = result;
                                 done();
                               });
                });
      });

      it("removes the player", done => {
        Player.findById(player.id)
              .then( result => {
                expect(result).toBeBlank();
                done();
              });
      });

      it("returns the stickerId", () => {
        expect(response.sticker_id).toEqual("BQADAQADpgUAAkeJSwABT9f-cyPFZJQC");
      });
    });

    describe("with @HayEquiBot baja", () => {
      let response;
      let player;

      beforeAll( done => {
        SpecUtil.createPlayer({ chat_id: chatId })
                .then( newPlayer => {
                  player = newPlayer;

                  payload.text = `@HayEquiBot baja ${player.nickname}`;
                  removeCommand = new Remove(payload);

                  removeCommand.run()
                               .then( result => {
                                 response = result;
                                 done();
                               });
                });
      });

      it("removes the player", done => {
        Player.findById(player.id)
              .then( result => {
                expect(result).toBeBlank();
                done();
              });
      });

      it("returns the stickerId", () => {
        expect(response.sticker_id).toEqual("BQADAQADpgUAAkeJSwABT9f-cyPFZJQC");
      });
    });

    describe("with upperCase nickname", () => {
      let response;
      let player;

      beforeAll( done => {
        SpecUtil.createPlayer({ nickname: "somenickname", chat_id: chatId })
                .then( newPlayer => {
                  player = newPlayer;

                  payload.text = `@HayEquiBot baja ${player.nickname.toUpperCase()}`;
                  removeCommand = new Remove(payload);

                  removeCommand.run()
                               .then( result => {
                                 response = result;
                                 done();
                               });
                });
      });

      it("removes the player", done => {
        Player.findById(player.id)
              .then( result => {
                expect(result).toBeBlank();
                done();
              });
      });

      it("returns the stickerId", () => {
        expect(response.sticker_id).toEqual("BQADAQADpgUAAkeJSwABT9f-cyPFZJQC");
      });
    });
  });

  describe("removed player", () => {
    describe("with /baja@HayEquiBot", () => {
      let response;

      beforeAll( done => {
        payload.text = "/baja@HayEquiBot removedPlayer";
        removeCommand = new Remove(payload);

        removeCommand.run()
                     .then( result => {
                       response = result;
                       done();
                     });
      });

      it("returns the error message", () => {
        expect(response.text).toEqual("");
      });
    });
  });

  describe("without nickname", () => {
    describe("no players", () => {
      describe("with /baja@HayEquiBot", () => {
        let response;

        beforeAll( done => {
          payload.text = "/baja@HayEquiBot";
          removeCommand = new Remove(payload);

          removeCommand.run()
                       .then( result => {
                         response = result;
                         done();
                       });
        });

        it("returns the error message", () => {
          expect(response.text).toEqual("mm! Nadie juega!");
        });
      });
    });

    describe("with players", () => {
      describe("with /baja@HayEquiBot", () => {
        let response;
        let player;

        beforeAll( done => {
          SpecUtil.createPlayer({ chat_id: chatId })
                  .then( newPlayer => {
                    player = newPlayer;

                    payload.text = "/baja@HayEquiBot";
                    removeCommand = new Remove(payload);

                    removeCommand.run()
                                 .then( result => {
                                   response = result;
                                   done();
                                 });
                  });
        });

        it("returns the ask and the keyboard", () => {
          let expectedKeyboard = {
            keyboard: [ [ player.nickname ] ],
            one_time_keyboard: true,
            resize_keyboard: true,
            selective: true
          };

          expect(response.text).toEqual("Quien se baja?");
          expect(response.reply_markup).toEqual(expectedKeyboard);
        });
      });
    });

  });
});
