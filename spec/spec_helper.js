import { sequelize } from "../models";

jasmine.cleanDb = function(done) {
  sequelize.query("TRUNCATE tg_players RESTART IDENTITY CASCADE")
           .then( () => {
              done();
            });
};
