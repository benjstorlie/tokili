const sequelize = require('../config/connection');
const axios = require('axios');
const fs = require('fs');
const { User, Card, Symbol, Board } = require('../models');

const userSeeds = require('./userSeeds.json');
const boardSeedData = require('./boardSeedData.json');

const boardSeeds = require('./boardSeeds.json');
const cardSeeds = require('./cardSeeds.json');
const symbolSeeds = require('./symbolSeeds.json');

const seedDatabase = async () => {

  // const { boardSeeds, cardSeeds, symbolSeeds, } = await restructureSeedData();

  await sequelize.sync({ force: true });

  await Symbol.bulkCreate(symbolSeeds);// No hooks right now

  await User.bulkCreate(userSeeds, {
    individualHooks: true,  // encrypts passwords
    returning: true,
  });

  // Boards have Users and Symbols
  await Board.bulkCreate(boardSeeds);
  // blank headings created in restructuring seeds, making heading hook unecessary

  await Card.bulkCreate(cardSeeds);
  // the restructuring function assigns "order" to the cards, so hooks not necessary, since that's the only card hook.

  process.exit(0);

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
      // Wrap the card iteration in a Promise.all to wait for all card fetches

      await Promise.all(cards.map( async (card,index) => {
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
      }));
    }
  }


  return {  boardSeeds, cardSeeds, symbolSeeds: removeDuplicatesById(symbolSeeds), }
}

const removeDuplicatesById = (arr) => {
  const uniqueIds = {}; // Object to keep track of unique IDs
  return arr.filter(item => {
    if (!uniqueIds[item.id]) {
      uniqueIds[item.id] = true; // Mark ID as encountered
      return true; // Include this item in the filtered array
    }
    return false; // Skip items with duplicate IDs
  });
}


const writeSeedFiles = async () => {
  const { boardSeeds, cardSeeds, symbolSeeds, } = await restructureSeedData();

  fs.writeFile('./seeds/boardSeeds.json', JSON.stringify(boardSeeds, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing boardSeeds JSON file:', err);
    } else {
      console.log('boardSeeds JSON file has been written successfully.');
    }
  });

  fs.writeFile('./seeds/cardSeeds.json', JSON.stringify(cardSeeds, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing cardSeeds JSON file:', err);
    } else {
      console.log('cardSeeds JSON file has been written successfully.');
    }
  });

  fs.writeFile('./seeds/symbolSeeds.json', JSON.stringify(symbolSeeds, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing symbolSeeds JSON file:', err);
    } else {
      console.log('symbolSeeds JSON file has been written successfully.');
    }
  });
}


seedDatabase();

// writeSeedFiles();

