const User = require('./User');
const Board = require('./Board');
const Card = require('./Card');
const Symbol = require('./Symbol');


// for One-To-One and One-to-Many relationships, ON DELETE defaults to SET NULL and ON UPDATE defaults to CASCADE.

// Unlike One-To-One and One-To-Many relationships, the defaults for both ON UPDATE and ON DELETE are CASCADE for Many-To-Many relationships

User.hasMany(Board, {
  onDelete: 'SET NULL'
});

Board.belongsTo(User, {
  foreignKey: 'user_id'
});

// Board has one "heading" Card (a unique association)
Board.belongsTo(Card, {
  as: 'heading', // Use a custom alias to distinguish this association
  foreignKey: 'heading_id', // Use the foreign key "heading_id" in the Board model
});

Card.hasOne(Board,{
  as: 'heading', // Use a custom alias to distinguish this association
  foreignKey: 'heading_id', // Use the foreign key "heading_id" in the Board model
})
// **********

// Board has many other cards (one-to-many association)
Board.hasMany(Card, {
  as: 'card', // Use a custom alias to distinguish this association
  foreignKey: 'board_id', // Use the foreign key "boardId" in the Card model
});

// Card belongs to a Board (to establish the relationship)
Card.belongsTo(Board, {
  foreignKey: 'board_id', // Use the foreign key "boardId" in the Card model
});
// **********

// Card has a many-to-many association with Symbol
Card.belongsToMany(Symbol, {
  through: 'CardSymbol', // Name of the join table
  foreignKey: 'card_id', // Foreign key in the join table referring to Card
  otherKey: 'symbol_id', // Foreign key in the join table referring to Symbol
});

Symbol.belongsToMany(Card, {
  through: 'CardSymbol', // Name of the join table
  foreignKey: 'symbol_id', // Foreign key in the join table referring to Symbol
  otherKey: 'card_id', // Foreign key in the join table referring to Card
});
// **********

// Board has one Symbol (a unique association)
Board.belongsTo(Symbol, {
  as: 'BoardSymbol', // Use a custom alias to distinguish this association
  foreignKey: 'symbol_id', // Use the foreign key "SymbolId" in the Board model
});

Symbol.hasOne(Board, {
  onDelete: 'SET NULL'
})
// **********


module.exports = { User, Board, Card, Symbol };
