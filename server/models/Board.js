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
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
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
      afterCreate: async (board, options) => {
        const [heading, created] = await Card.findOrCreate({
          where: { board_id:board.id, heading: true }, defaults: {show: false} 
        });
      }
    }
  }
);

module.exports = Board;
