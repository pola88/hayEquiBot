import { Limit } from "../../../lib/commands";
import { GroupConfig } from "../../../models";
import payload from "../../assets/payload.json";

require("jasmine-before-all");

describe("Limit command", () => {

  describe("is", () => {
    it("with /somos@HayEquiBot", () => {
      expect(Limit.is("/somos@HayEquiBot")).toBe(true);
    });

    it("with /somos", () => {
      expect(Limit.is("/somos")).toBe(true);
    });

    it("with @HayEquiBot juega", () => {
      expect(Limit.is("@HayEquiBot somos")).toBe(true);
    });
  });

  describe("Invalid number", () => {
    let LimitCommand;

    beforeAll( done => {
      jasmine.cleanDb( () => {
        payload.text = "/somos@HayEquiBot lala";
        LimitCommand = new Limit(payload);
        done();
      });
    });

    it("returns error message", done => {
      LimitCommand.run()
                 .then( response => {
                   expect(response.text).toEqual("Tenes que poner un numero.");
                   done();
                 });
    });
  });

  describe("Set limit to groupConfig", () => {
    let LimitCommand;
    let chatId;

    beforeAll( done => {
      jasmine.cleanDb( () => {
        chatId = payload.chat.id.toString();

        payload.text = "/somos@HayEquiBot 10";
        LimitCommand = new Limit(payload);
        done();
      });
    });

    it("limit number of players", done => {
      LimitCommand.run()
                 .then( response => {
                   expect(response.text).toEqual("Ahora solo pueden jugar 10 jugadores, los otros son suplentes.");

                   GroupConfig.findOne({ where: { chat_id: chatId } })
                              .then( groupConfig => {
                                expect(groupConfig.number_of_players).toEqual(10);
                                done();
                              });
                 });
    });
  });
});
