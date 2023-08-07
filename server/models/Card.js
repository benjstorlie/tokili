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
    heading: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'card',
    hooks: {
      beforeCreate: async (card,options) => {
        try {
          // Assuming if card.order is defined in the card creation that it is correct.
          // isInteger would be false for null and undefined, but not 0.
          if (!card.heading && !Number.isInteger(card.order)) {
            const highestOrderCard = await Card.findOne({
              where: { board_id: card.board_id, heading: false },
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
