const router = require('express').Router();
const { Board } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    const board = await Board.create({
      title, 
      userId: req.session.userId,
    });

    res.status(200).json({message: "Success", board});
  } catch (err) {
    res.status(500).json(err);
  }
});


const get = {
  async all(req,res) {
    try {

    } catch (err) {
      res.status(500).json(err);
    }
  },

  async one(req,res) {
    try {

    } catch (err) {
      res.status(500).json(err);
    }
  }
}

const post = {
  async new(req, res) {
    try {
      const { title } = req.body;
      const board = await Board.create({
        title, 
        userId: req.session.userId,
      });
  
      res.status(200).json(board);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // '/boards/:boardId/copy'
  async copy(req,res) {
    try {
      const { title } = req.body;
      const board_id = req.params.boardId;

      const origBoard = Board.findByPk(board_id, {
        include: [
          { model: Card, as: 'heading' }, // Alias 'heading' represents the "hasOne" association
          { model: Card, as: 'card' }, // Alias 'card' represents the "hasMany" association
        ],
      });
      if (!origBoard) {
        res.status(404).json({error: 'Board not found.'});
        return;
      }

      // create new board
      const newBoard = await Board.create({
        title: title || origBoard.title + ' copy',
        user_id: req.session.userId,
        symbol_id: origBoard.symbol_id,
      });

      // create new heading, associated by the newBoard's id
      await Card.create({
        title: origBoard.heading.title,
        symbol_id: origBoard.heading.symbol_id,
        board_id: newBoard.id
      });

      // create new cards, associated by the newBoard's id
      await Card.bulkCreate(
        origBoard.cards.map( 
          card => ({
            title: card.title,
            symbol_id: card.symbol_id,
            board_id: newBoard.id
          })
        )
      );

    } catch (err) {
      res.status(500).json(err);
    }
  },

  async search(req,res) {
    try {
      const searchTerm = req.query.q;
      const apiUrl = `https://www.opensymbols.org/api/symbols?access_token=${process.env.OPEN_SYMBOLS_TOKEN}&q=${searchTerm}`;
  
      const response = await axios.get(apiUrl);
      const symbolsData = response.data; // response contains an array of symbol objects
  
      // Extract relevant data (image_url, symbol_key, id) from the API response
      const symbols = symbolsData.map(symbol => ({
        image_url: symbol.image_url,
        details_url: symbol.details_url,
        id: symbol.id,
      }));
  
      res.json(symbols);
    } catch (error) {
      console.error('Error fetching symbols:', error.message);
      res.status(500).json({ error: 'Failed to fetch symbols' });
    }
  },
}

const put = {
  // '/cards/:cardId'
  async update(req, res) {
    try {
      const card_id = req.params.cardId;
  
      card = await Card.update( req.body ,{where: {id: card_id}});
      res.status(200).json(card);

    } catch (error) {
      console.error('Error updating card:', error.message);
      res.status(500).json({ error: 'Failed update card.' });
    }    
  },
// '/cards/:cardId/symbol'
  async assignCardSymbol(req, res) {
    try {
      const card_id = req.params.cardId;
      const { details_url } = req.body; 
  
      // Fetch the symbol object from the external API using symbol_key and id
      const apiUrl = `https://www.opensymbols.org/api/v2`+details_url;
      const response = await axios.get(apiUrl);
      const symbolData = response.data; // response contains the symbol object
  
      // Create a Symbol record in the database if it doesn't exist already
      const [symbol, created] = await Symbol.findOrCreate({
        where: { id: symbolData.id },
        defaults: symbolData,
      });
  
      // Associate the Symbol with the Card by updating the Card record
      await Card.update({ symbol_id: symbol.id }, { where: { id: card_id } });
  
      res.json({ success: true, message: 'Symbol assigned to Card successfully' });
    } catch (error) {
      console.error('Error assigning symbol to card:', error.message);
      res.status(500).json({ error: 'Failed to assign symbol to card' });
    }
  },
  // '/boards/:boardId/symbol'
  async assignBoardSymbol(req, res) {
    try {
      const board_id = req.params.boardId;
      const { details_url } = req.body; 

      // Fetch the symbol object from the external API using symbol_key and id
      const apiUrl = `https://www.opensymbols.org/api/v2`+details_url;
      const response = await axios.get(apiUrl);
      const symbolData = response.data; // response contains the symbol object

      // Create a Symbol record in the database if it doesn't exist already
      const [symbol, created] = await Symbol.findOrCreate({
        where: { id: symbolData.id },
        defaults: symbolData,
      });

      // Associate the Symbol with the Board by updating the Board record
      await Board.update({ symbol_id: symbol.id }, { where: { id: board_id } });

      res.json({ success: true, message: 'Symbol assigned to Board successfully' });
    } catch (error) {
      console.error('Error assigning symbol to board:', error.message);
      res.status(500).json({ error: 'Failed to assign symbol to board' });
    }
  },
}

module.exports = router;