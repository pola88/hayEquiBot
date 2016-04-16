'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('tg_group_configs',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        chat_id: {
          type: Sequelize.STRING,
          allowNull: false
        },
        number_of_players: {
          type: Sequelize.INTEGER,
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
      return queryInterface.addIndex('tg_group_configs', ['chat_id']);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('tg_group_configs');
  }
};
