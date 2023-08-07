const sequelize = require('../config/connection');
const axios = require('axios');
const { User, Card, Symbol, Board } = require('../models');

const userSeeds = require('./userSeeds.json');
const boardSeedData = require('./boardSeedData.json');

const seedDatabase = async () => {

  const { boardSeeds, cardSeeds, symbolSeeds, } = await restructureSeedData();

  await sequelize.sync({ force: true });

  await Symbol.bulkCreate(symbolSeeds);// No hooks right now

  await User.bulkCreate(userSeeds, {
    individualHooks: true,  // encrypts passwords
  });

  // Boards have Users and Symbols
  await Board.bulkCreate(boardSeeds);
  // blank headings created in restructuring seeds, making heading hook unecessary

  await Card.bulkCreate(cardSeeds);
  // the restructuring function assigns "order" to the cards, so hooks not necessary, since that's the only card hook.
}

const createSymbol = async ( details_url ) => {
  try {
    const apiUrl = `https://www.opensymbols.org/api/v2` + details_url;
    const response = await axios.get(apiUrl);
    return response.data.symbol;

  } catch (err) {
    console.error( `Error fetching data for symbol with details_url: ${details_url}`, err );
  }
}


const restructureSeedData = async () => {

  const boardSeeds = [];
  const cardSeeds = [];
  const symbolSeeds = [];

  for (const seed of boardSeedData) {
    const {id, title, user_id, symbol_url, heading, cards} = seed;

    const boardData = {id};
    if (title) { boardData.title = title }
    if (user_id) { boardData.user_id = user_id }
    if (symbol_url) {
      try {
        const symbolData = await createSymbol( symbol_url );
        symbolSeeds.push(symbolData);
        boardData.symbol_id = symbolData.id;
      } catch {
        console.error( `Error fetching data for symbol with details_url: ${details_url} for Board id#${id} ${title ? title : ''}` );
      }
    }

    boardSeeds.push(boardData);
    const headingData = {
      board_id: id,
      heading: true
    };
    if (heading) {
      if (heading.title) {headingData.title = heading.title}
      if (heading.symbol_url) {
        try {
          const symbolData = await createSymbol( heading.symbol_url );
          symbolSeeds.push(symbolData);
          headingData.symbol_id = symbolData.id;
        } catch {
          console.error( `Error fetching data for symbol with details_url: ${details_url} for Heading ${heading.title ? heading.title : ''}for Board id#${id} ${title ? title : ''}` );
        }
      }
    } else {
      // if heading wasn't defined, have default heading be hidden
      headingData.show = false;
    }
    cardSeeds.push(headingData);

    if (cards) {
      cards.forEach( async (card,index) => {
        const cardData = {
          board_id: id,
          order: index,
        };
        if (card.title) {cardData.title = card.title}
        if (card.symbol_url) {
          try {
            const symbolData = await createSymbol( card.symbol_url );
            symbolSeeds.push(symbolData);
            cardData.symbol_id = symbolData.id;
          } catch {
            console.error( `Error fetching data for symbol with details_url: ${details_url} for Card ${card.title ? card.title : ''}for Board id#${id} ${title ? title : ''}` );
          }
        }
  
        cardSeeds.push(cardData);
      });
    }
  }

  return {  boardSeeds, cardSeeds, symbolSeeds, }
}


seedDatabase();