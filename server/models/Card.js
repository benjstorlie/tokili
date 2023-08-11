const { Model, DataTypes , Op } = require('sequelize');
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
        // if applicable, assign card order to be the lowest unused integer.
        try {
          // Assuming if card.order is defined in the card creation that it is correct.
          // isInteger would be false for null and undefined, but not 0.
          if (!card.heading && card.show && !Number.isInteger(card.order)) {
            const currentCards = await Card.findAll({
              where: { 
                board_id: card.board_id, 
                heading: false, 
                show: true, 
                order: { [Op.not]: null }, 
              },
              attributes: ['order']
            });
            
            const currentOrderValues = currentCards.map( c => c.order);
            const maxOrder = Math.max(...currentOrderValues);

            // A quick check to see if the orders are already inclusive, assuming uniqueness.
            if (maxOrder+1 === currentOrderValues.length ) {
              card.order = maxOrder+1;
            } else {
              // increment newOrder and find the first unused integer, then end loop
              let newOrder = 0;
              for (let i = 0; i <= maxOrder + 1; i++) {
                if (!currentOrderValues.includes(i)) {
                  newOrder = i;
                  break;
                }
              }
              card.order = newOrder;
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
