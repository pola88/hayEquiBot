import { MultipleAdd } from "../../../lib/commands";
import { Player } from "../../../models";
import payload from "../../assets/payload.json";
import SpecUtil from "../../spec_utils";

require("jasmine-before-all");

describe("MultipleAdd command", () => {
  let addCommand;

  beforeAll( done => {
    jasmine.cleanDb(done);
  });

  describe("is", () => {
    it("with /juega@HayEquiBot", () => {
      expect(MultipleAdd.is("/juega@HayEquiBot")).toBe(true);
    });

    it("with /juega", () => {
      expect(MultipleAdd.is("/juega")).toBe(true);
    });

    it("with @HayEquiBot juega", () => {
      expect(MultipleAdd.is("@HayEquiBot juega")).toBe(true);
    });
  });

  describe("valid nickname", () => {

    describe("with /juega@HayEquiBot", () => {
      let response;

      beforeAll( done => {
        payload.text = "/juega@HayEquiBot fromTestWith@, fromTestWith@2";
        addCommand = new MultipleAdd(payload);

        addCommand.run()
                  .then( result => {
                    response = result;
                    done();
                  });
      });

      it("creates the player", done => {
        Player.findOne({ where: { nickname: "fromTestWith@", chat_id: payload.chat.id.toString() }})
              .then( result => {
                expect(result).not.toBeBlank();
                done();
              });
      });

      it("creates the player", done => {
        Player.findOne({ where: { nickname: "fromTestWith@2", chat_id: payload.chat.id.toString() }})
              .then( result => {
                expect(result).not.toBeBlank();
                done();
              });
      });

      it("returns the success message", () => {
        expect(response.text).toEqual("Que viva el futbol!!\nAhora somos 2:\nfromTestWith@\nfromTestWith@2\n-------------\n");
      });
    });

    describe("with /juega", () => {
      beforeAll( done => {
        payload.text = "/juega fromTest, fromTest2";
        addCommand = new MultipleAdd(payload);

        addCommand.run()
                  .then( () => {
                    done();
                  });
      });

      it("creates the player", done => {
        Player.findOne({ where: { nickname: "fromTest", chat_id: payload.chat.id.toString() }})
              .then( result => {
                expect(result).not.toBeBlank();
                done();
              });
      });

      it("creates the player 2", done => {
        Player.findOne({ where: { nickname: "fromTest2", chat_id: payload.chat.id.toString() }})
              .then( result => {
                expect(result).not.toBeBlank();
                done();
              });
      });
    });

    describe("with @HayEquiBot juega", () => {
      beforeAll( done => {
        payload.text = "@HayEquiBot juega fromTestWithMention, fromTestWithMention2";
        addCommand = new MultipleAdd(payload);

        addCommand.run()
                  .then( () => {
                    done();
                  });
      });

      it("creates the player", done => {
        Player.findOne({ where: {nickname: "fromTestWithMention", chat_id: payload.chat.id.toString() }})
              .then( result => {
                expect(result).not.toBeBlank();
                done();
              });
      });

      it("creates the player", done => {
        Player.findOne({ where: {nickname: "fromTestWithMention2", chat_id: payload.chat.id.toString() }})
              .then( result => {
                expect(result).not.toBeBlank();
                done();
              });
      });
    });

    describe("with one mame", () => {
      beforeAll( done => {
        payload.text = "/juega fromTestOnlyMe";
        addCommand = new MultipleAdd(payload);

        addCommand.run()
                  .then( () => {
                    done();
                  });
      });

      it("creates the player", done => {
        Player.findOne({ where: { nickname: "fromTestOnlyMe", chat_id: payload.chat.id.toString() }})
              .then( result => {
                expect(result).not.toBeBlank();
                done();
              });
      });
    });
  });
  //TODO: should return an error
  describe("repeated nickname", () => {
    describe("with /juega", () => {
      let chatId;
      let repeatedPlayer;

      beforeAll( done => {
        chatId = payload.chat.id.toString();

        SpecUtil.createPlayer({ chat_id: chatId })
                .then( player => {
                  repeatedPlayer = player;

                  payload.text = `/juega ${player.nickname}`;
                  addCommand = new MultipleAdd(payload);

                  addCommand.run()
                            .then( () => {
                              done();
                            });
                });
      });

      it("does not create the player", done => {
        Player.findAll({ where: { nickname: repeatedPlayer.nickname, chat_id: chatId }})
              .then( result => {
                // expect(result).not.toBeBlank();
                expect(result.length).toEqual(1);
                done();
              });
      });
    });
  });

  describe("without nickname", () => {
    let response;

    describe("with /juega@HayEquiBot", () => {
      beforeAll( done => {

        payload.text = "/juega@HayEquiBot";
        addCommand = new MultipleAdd(payload);

        addCommand.run()
                  .then( result => {
                    response = result;
                    done();
                  });
      });

      it("returns error message", () => {
        expect(response.text).toEqual("Quien?? quien juega?? Ah no, no pusiste ningun nombre.");
      });
    });

    describe("with /juega", () => {
      beforeAll( done => {
        payload.text = "/juega";
        addCommand = new MultipleAdd(payload);

        addCommand.run()
                  .then( result => {
                    response = result;
                    done();
                  });
      });

      it("returns error message", () => {
        expect(response.text).toEqual("Quien?? quien juega?? Ah no, no pusiste ningun nombre.");
      });
    });

    describe("with @HayEquiBot juega", () => {
      beforeAll( done => {
        payload.text = "@HayEquiBot juega";
        addCommand = new MultipleAdd(payload);

        addCommand.run()
                  .then( result => {
                    response = result;
                    done();
                  });
      });

      it("returns error message", () => {
        expect(response.text).toEqual("Quien?? quien juega?? Ah no, no pusiste ningun nombre.");
      });
    });
  });
});
