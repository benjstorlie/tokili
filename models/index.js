const User = require('./User');
const Board = require('./Board');
const Card = require('./Card');


// for One-To-One and One-to-Many relationships, ON DELETE defaults to SET NULL and ON UPDATE defaults to CASCADE.

// Unlike One-To-One and One-To-Many relationships, the defaults for both ON UPDATE and ON DELETE are CASCADE for Many-To-Many relationships

User.hasMany(Board, {
  onDelete: 'CASCADE'
});

Board.belongsTo(User, {
  foreignKey: 'userId'
});

// Board has one "heading" Card (a unique association)
Board.hasOne(Card, {
  as: 'heading', // Use a custom alias to distinguish this association
  foreignKey: 'boardId', // Use the foreign key "boardId" in the Card model
});

// Board has many other cards (one-to-many association)
Board.hasMany(Card, {
  as: 'card', // Use a custom alias to distinguish this association
  foreignKey: 'boardId', // Use the foreign key "boardId" in the Card model
});

// Card belongs to a Board (to establish the relationship)
Card.belongsTo(Board, {
  foreignKey: 'boardId', // Use the foreign key "boardId" in the Card model
});


module.exports = { User, Board, Card };
