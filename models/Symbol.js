const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Symbol = sequelize.define('Symbol', 
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
    hc: {
      type: DataTypes.BOOLEAN,
    },
    protected_symbol: {
      type: DataTypes.BOOLEAN,
    },
    extension: {
      type: DataTypes.STRING,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    search_string: {
      type: DataTypes.STRING,
    },
    unsafe_result: {
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
    freezeTableName: true,
    underscored: true,
    modelName: 'symbol',
  }
);