const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


class Card extends Model {}

Card.init(
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
    kind: {
      type: DataTypes.ENUM('card','heading'),
      defaultValue: 'card'
    },
    board_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'board',
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
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // This value is irrelevant for Heading cards.
    },
    show: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'card',
    hooks: {
      beforeCreate: async (card,options) => {
        try {
          if (card.kind === 'card') {
            const highestOrderCard = await Card.findOne({
              where: { board_id: card.board_id },
              order: [['order', 'DESC']],
            });
        
            if (highestOrderCard) {
              card.order = highestOrderCard.order + 1;
            } else {
              card.order = 0;
            }
          }
        } catch (error) {
          console.error('Error setting card order:', error.message);
          throw error;
        }
      }
    }
  }
);

module.exports = Card;
