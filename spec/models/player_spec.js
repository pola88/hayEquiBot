import Utils from "../spec_utils";
import models from "../../models";
require("jasmine-before-all");

describe("Player model", () => {

  describe("nickname", () => {
    describe("create in lowercase", () => {
      let player;

      beforeAll( done => {
        jasmine.cleanDb( () => {
          models.Player.create({ nickname: "UPPErCASE", chat_id: "1"})
                .then( result => {
                  player = result;
                  done();
                })
        });
      });

      it("convert to lowercase", done => {
        models.Player.findById(player.id)
              .then( newResult => {
                expect(newResult.nickname).toEqual("uppercase");
                done();
              });
      });
    });

    describe("find with nickname in uppercase", () => {
      let player;

      beforeAll( done => {
        jasmine.cleanDb( () => {
          models.Player.create({ nickname: "lowerCase", chat_id: "1"})
                .then( result => {
                  player = result;
                  done();
                })
        });
      });

      it("find the player", done => {
        models.Player.findOne({ where: { nickname: "LOWERCASE" }})
              .then( newResult => {
                expect(newResult.id).toEqual(player.id);
                done();
              });
      });
    });
  });

  describe("findWithTeam", () => {
    beforeAll( done => {
      jasmine.cleanDb( () => {
        Utils.createPlayer({team: "0", chat_id: "1"})
             .then( () => {
               Utils.createPlayer({team: "1", chat_id: "1"})
                    .then( () => {
                      Utils.createPlayer({team: "1"})
                           .then( () => {
                             Utils.createPlayer({team: "1", chat_id: "1"})
                                  .then( () => {
                                    Utils.createPlayer({ chat_id: "1" })
                                         .then( () => {
                                           done();
                                         });
                                  });
                           });
                    });
             });
      });
    });

    it("return only player with team", done => {
      models.Player.findWithTeam("1")
            .then(result => {
              expect(result.length).toEqual(3);
              done();
            });
    });

  });
});
