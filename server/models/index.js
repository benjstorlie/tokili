const User = require('./User');
const Board = require('./Board');
const Card = require('./Card');
const Symbol = require('./Symbol');


// for One-To-One and One-to-Many relationships, ON DELETE defaults to SET NULL and ON UPDATE defaults to CASCADE.

// Unlike One-To-One and One-To-Many relationships, the defaults for both ON UPDATE and ON DELETE are CASCADE for Many-To-Many relationships

User.hasMany(Board, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Board.belongsTo(User, {
  foreignKey: 'user_id'
});

// Board has many other cards (one-to-many association)
Board.hasMany(Card, {
  foreignKey: 'board_id', 
  onDelete: 'CASCADE'
});

Card.belongsTo(Board, {
  foreignKey: 'board_id',
});
// **********

// Card has a many-to-many association with Symbol
Card.belongsTo(Symbol, {
  foreignKey: 'symbol_id', 
});

Symbol.hasMany(Card, {
  foreignKey: 'symbol_id',
  onDelete: 'SET NULL'
});
// **********

// Board has one Symbol (a unique association)
Board.belongsTo(Symbol, {
  as: 'BoardSymbol', // Use a custom alias to distinguish this association
  foreignKey: 'symbol_id', // Use the foreign key "SymbolId" in the Board model
});

Symbol.hasOne(Board, {
  foreignKey: "symbol_id",
  onDelete: 'SET NULL'
})
// **********

module.exports = { User, Board, Card, Symbol };
