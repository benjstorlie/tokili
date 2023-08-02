const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

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
  }
);

module.exports = Board;
