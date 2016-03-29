import { Team } from "../../../lib/commands";
import payload from "../../assets/payload.json";
import SpecUtil from "../../spec_utils";

require("jasmine-before-all");

describe("Team command", () => {
  let teamCommand;
  let chatId;

  beforeAll( done => {
    jasmine.cleanDb(done);
    chatId = payload.chat.id.toString();
  });


  describe("is", () => {
    it("with /equipos@HayEquiBot", () => {
      expect(Team.is("/equipos@HayEquiBot")).toBe(true);
    });

    it("with /equipos", () => {
      expect(Team.is("/equipos")).toBe(true);
    });

    it("with @HayEquiBot equipos", () => {
      expect(Team.is("@HayEquiBot equipos")).toBe(true);
    });
  });

  describe("without player", () => {

    describe("with /equipos@HayEquiBot", () => {
      let response;

      beforeAll( done => {
        payload.text = "/equipos@HayEquiBot";
        teamCommand = new Team(payload);

        teamCommand.run()
                  .then( result => {
                    response = result;
                    done();
                  });
      });

      it("returns the error message", () => {
        expect(response.text).toEqual("No hay ningun equipo todavia.");
      });
    });

    describe("with /equipos", () => {
      let response;

      beforeAll( done => {
        payload.text = "/equipos";
        teamCommand = new Team(payload);

        teamCommand.run()
                  .then( result => {
                    response = result;
                    done();
                  });
      });

      it("returns the error message", () => {
        expect(response.text).toEqual("No hay ningun equipo todavia.");
      });
    });

    describe("with @HayEquiBot equipos", () => {
      let response;

      beforeAll( done => {
        payload.text = "@HayEquiBot equipos";
        teamCommand = new Team(payload);

        teamCommand.run()
                  .then( result => {
                    response = result;
                    done();
                  });
      });

      it("returns the error message", () => {
        expect(response.text).toEqual("No hay ningun equipo todavia.");
      });
    });
  });

  describe("with player but different chatId", () => {

    describe("with /equipos", () => {
      let response;

      beforeAll( done => {
        payload.text = "/equipos";
        teamCommand = new Team(payload);

        SpecUtil.createPlayer({ team: "0", chat_id: "1"})
                .then( () => {
                  SpecUtil.createPlayer({ team: "1", chat_id: "1"})
                          .then( () => {
                            SpecUtil.createPlayer({ chat_id: chatId })
                                    .then( () => {
                                      teamCommand.run()
                                                .then( result => {
                                                  response = result;
                                                  done();
                                                });
                                    });
                          });
                });
      });

      it("returns the error message", () => {
        expect(response.text).toEqual("No hay ningun equipo todavia.");
      });
    });
  });

  describe("with teams", () => {

    describe("with /equipos", () => {
      let response;
      let teamA;
      let teamB;

      beforeAll( done => {
        payload.text = "/equipos";
        teamCommand = new Team(payload);

        SpecUtil.createPlayer({ team: "0", chat_id: chatId})
                .then( newPlayerA => {
                  teamA = newPlayerA.nickname;
                  SpecUtil.createPlayer({ team: "1", chat_id: chatId })
                          .then( newPlayerB => {
                            teamB = newPlayerB.nickname;
                            SpecUtil.createPlayer({ chat_id: chatId })
                                    .then( () => {
                                      teamCommand.run()
                                                .then( result => {
                                                  response = result;
                                                  done();
                                                });
                                    });
                          });
                });
      });

      it("returns the teams", () => {
        expect(response.text).toEqual(`<b>Equipo 1:</b>${teamA}\n<b>Equipo 2:</b>${teamB}`);
      });
    });
  });
});
