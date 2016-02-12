import { Add } from "../../../lib/commands";
import { Player } from "../../../models";
import payload from "../../assets/payload.json";
import SpecUtil from "../../spec_utils";

require("jasmine-before-all");

describe("Add command", () => {
  let addCommand;

  beforeAll( done => {
    jasmine.cleanDb(done);
  });

  describe("is", () => {
    it("with /juega@HayEquiBot", () => {
      expect(Add.is("/juega@HayEquiBot")).toBe(true);
    });

    it("with /juega", () => {
      expect(Add.is("/juega")).toBe(true);
    });

    it("with @HayEquiBot juega", () => {
      expect(Add.is("@HayEquiBot juega")).toBe(true);
    });
  });

  describe("valid nickname", () => {

    describe("with /juega@HayEquiBot", () => {
      let response;

      beforeAll( done => {
        payload.text = "/juega@HayEquiBot fromTestWith@";
        addCommand = new Add(payload);

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

      it("returns the success message", () => {
        expect(response.text).toEqual("Que viva el futbol!!");
      });
    });

    describe("with /juega", () => {
      beforeAll( done => {
        payload.text = "/juega fromTest";
        addCommand = new Add(payload);

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
    });

    describe("with @HayEquiBot juega", () => {
      beforeAll( done => {
        payload.text = "@HayEquiBot juega fromTestWithMention";
        addCommand = new Add(payload);

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
    });
  });

  describe("repeated nickname", () => {
    describe("with /juega", () => {
      let chatId;
      let repeatedPlayer;
      let response;

      beforeAll( done => {
        chatId = payload.chat.id.toString();

        SpecUtil.createPlayer({ chat_id: chatId })
                .then( player => {
                  repeatedPlayer = player;

                  payload.text = `/juega ${player.nickname}`;
                  addCommand = new Add(payload);

                  addCommand.run()
                            .then( result => {
                              response = result;
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

      it("returns error message", () => {
        expect(response.text).toEqual("Ya estas anotado pibe, gracias que podes \"correr\" y queres jugar por 2?");
      });
    });

    describe("with /juega and upperCase", () => {
      let chatId;
      let response;

      beforeAll( done => {
        chatId = payload.chat.id.toString();

        SpecUtil.createPlayer({ nickname: "uPpeRCase", chat_id: chatId })
                .then( () => {
                  payload.text = `/juega UPPERCASE`;
                  addCommand = new Add(payload);

                  addCommand.run()
                            .then( result => {
                              response = result;
                              done();
                            });
                });
      });

      it("does not create the player", done => {
        Player.findAll({ where: { nickname: { $iLike: "uPpeRCase"}, chat_id: chatId }})
              .then( result => {
                expect(result.length).toEqual(1);
                done();
              });
      });

      it("returns error message", () => {
        expect(response.text).toEqual("Ya estas anotado pibe, gracias que podes \"correr\" y queres jugar por 2?");
      });
    });
  });

  describe("without nickname", () => {
    let response;

    describe("with /juega@HayEquiBot", () => {
      beforeAll( done => {

        payload.text = "/juega@HayEquiBot";
        addCommand = new Add(payload);

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
        addCommand = new Add(payload);

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
        addCommand = new Add(payload);

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
