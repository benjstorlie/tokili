const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Symbol extends Model {}

Symbol.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      // The id will come from the Open Symbols API
    },
    symbol_key: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    locale: {
      type: DataTypes.STRING,
    },
    license: {
      type: DataTypes.STRING,
    },
    license_url: {
      type: DataTypes.STRING,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
    },
    author: {
      type: DataTypes.STRING,
    },
    author_url: {
      type: DataTypes.STRING,
    },
    source_url: {
      type: DataTypes.STRING,
    },
    repo_key: {
      type: DataTypes.STRING,
    },
    hc: {  // high contrast
      type: DataTypes.BOOLEAN,
    },
    // protected_symbol: {
    //   type: DataTypes.BOOLEAN,
    // },
    extension: {  // png, svg, ...
      type: DataTypes.STRING,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    search_string: {
      type: DataTypes.TEXT,
    },
    unsafe_result: {  // for safesearch on or off.
      type: DataTypes.BOOLEAN,
      default: false,
    },
    skins: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    _href: {
      type: DataTypes.STRING,
    },
    details_url: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'symbol',
  }
);


module.exports = Symbol;