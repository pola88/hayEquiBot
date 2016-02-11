import Utils from "../spec_utils";
import models from "../../models";
require("jasmine-before-all");

describe("Player model", () => {
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
