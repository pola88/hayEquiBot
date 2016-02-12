import { sequelize } from "../models";
import customMatchers from "./spec_custom_matchers";

beforeEach(function() {
  jasmine.addMatchers(customMatchers);
});

jasmine.cleanDb = function(done) {
  sequelize.query("TRUNCATE tg_players RESTART IDENTITY CASCADE")
           .then( () => {
              done();
            });
};
