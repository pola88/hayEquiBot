module.exports = function(sequelize, DataTypes) {
  var Player = sequelize.define('Player', {
    nickname: { type: DataTypes.STRING, allowNull: false,
                validate: {
                            isUnique: function(value, next) {
                                    if(this.changed('nickname') && this.chat_id) {
                                      Player.findAll({ where: { nickname: value, chat_id: this.chat_id } })
                                            .then( resp => {
                                              if(resp.length !== 0) {
                                                next('Nickname already in use.');
                                              } else {
                                                next();
                                              }
                                            });
                                    } else {
                                      next();
                                    }
                                  }
                          }
              },
     chat_id: { type: DataTypes.STRING, allowNull: false },
     team: { type: DataTypes.STRING, allowNull: true,
                  validate: { isIn: [ [ '0', '1'] ] } }
  }, {
    tableName: 'tg_players',
    associate: function(models) {
    },
    hooks: {
      beforeCreate: function(player, options, fn) {
        if(player.nickname) {
          player.nickname = player.nickname.toLowerCase();
        }

        fn(null, player);
      },
      beforeFind: function(options, fn) {
        if(options.where && options.where.nickname && typeof options.where.nickname !== 'object') {
          options.where.nickname = options.where.nickname.toLowerCase();
        }

        fn(null);
      },
    },
    classMethods: {
      findWithTeam: function(chatId) {
        return Player.findAll({ where: { chat_id: chatId, $not: [ { team: null } ] } });
      }
    }

  });

  return Player;
};
