'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('tg_players',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nickname: {
          type: Sequelize.STRING,
          allowNull: false
        },
        chat_id: {
          type: Sequelize.STRING,
          allowNull: false
        },
        team: {
          type: Sequelize.STRING(1),
          allowNull: true
        },
        created_at: {
          type: Sequelize.DATE
        },
        updated_at: {
          type: Sequelize.DATE
        }
      }
    ).then( function() {
      return queryInterface.addIndex('tg_players', ['nickname', 'chat_id']);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('tg_players');
  }
};
