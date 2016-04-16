module.exports = function(sequelize, DataTypes) {
  var GroupConfig = sequelize.define('GroupConfig', {
     chat_id: { type: DataTypes.STRING, allowNull: false },
     number_of_players: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    tableName: 'tg_group_configs',
    associate: function(models) {
    },
    hooks: {
    },
    classMethods: {
    }
  });

  return GroupConfig;
};
