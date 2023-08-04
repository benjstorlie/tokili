const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Card = require('./Card');

class Board extends Model {}

Board.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    heading_id: {
      type: DataTypes.INTEGER,
      allowNull: true,  // heading gets assigned in beforeCreate hook
      references: {
        model: 'card',
        key: 'id',
      },
    },
    symbol_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'symbol',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'board',
    hooks: {
      beforeCreate: async (board, options) => {
        const heading = await Card.create( { show: false } )
        board.heading_id = heading.id;
      }
    }
  }
);

module.exports = Board;
