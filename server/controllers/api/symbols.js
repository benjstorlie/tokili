const router = require('express').Router();
const axios = require('axios');
const { Card , Board, Symbol } = require('../../models');

// Scroll to the end to see the routes

const get = {
  async search(req,res) {
    try {
      const searchTerm = req.query.q;
      const apiUrl = `https://www.opensymbols.org/api/symbols?access_token=${process.env.OPEN_SYMBOLS_TOKEN}&q=${searchTerm}`;
  
      const response = await axios.get(apiUrl);
      const symbolsData = response.data; // response contains an array of symbol objects

      // These are possible error messages from the external API.
      if (symbolsData.token_expired) {
        res.status(401).json({token_expired: true});
        return;
      } else if (symbolsData.throttled) {
        res.status(429).json({throttled: true});
        return;
      }
  
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
  
  async all(req,res) {
    try {
      const symbolData = await Symbol.findAll({
        include: [
          {model: Board, attributes: ['id','title']},
          {model: Card, attributes: ['id','title']}
        ]
      });
      res.json(symbolData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async one(req,res) {
    try {
      const symbolData = await Symbol.findByPk(req.params.symbolId);
      !symbolData
        ? res.status(404).json({error: 'No symbol found.'})
        : res.status(200).json(symbolData);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

const post = {
  async new(req, res) {
    try {
      // This should be the same details_url attribute that comes from the Open Symbols API
      const { details_url } = req.body; 

      // Fetch the symbol object from the external API using the details_url.  --Could also use the symbol_key and id
      // This returns the same kind of symbol object that is in the search results array.
      const apiUrl = `https://www.opensymbols.org/api/v2` + details_url;
      const response = await axios.get(apiUrl);
      const symbolData = response.data.symbol; // response contains the symbol object
  
      // Create a Symbol record in the database if it doesn't exist already
      const [symbol, created] = await Symbol.findOrCreate({
        where: { id: symbolData.id },
        defaults: symbolData,
      });
  
      res.status(200).json(symbol);
    } catch (err) {
      res.status(500).json(err);
    }
  },
    // '/symbols'
    // I structured assigning symbols like this, because it is the same method to assign a symbol to a Board as to a Card
    // And this is used in the Modal component, shared by Card and Board, as well
    async assign(req, res) {
    try {
      // 
      const { details_url, model_id, model } = req.body; 
  
      // Fetch the symbol object from the external API using symbol_key and id
      const apiUrl = `https://www.opensymbols.org/api/v2`+details_url;
      const response = await axios.get(apiUrl);
      const symbolData = response.data.symbol; // response contains the symbol object
  
      // Create a Symbol record in the database if it doesn't exist already
      const [symbol, created] = await Symbol.findOrCreate({
        where: { id: symbolData.id },
        defaults: symbolData,
      });
  
      if (model === 'card') {
        // Associate the Symbol with the Card by updating the Card record
        const card = await Card.update({ symbol_id: symbol.id }, { where: { id: model_id } });
        res.json({ success: true, message: 'Symbol assigned to Card successfully' }, ...card);
      } else if (model === 'board') {
        // Associate the Symbol with the Board by updating the Board record
        const board = await Board.update({ symbol_id: symbol.id }, { where: { id: model_id } });
        res.json({ success: true, message: 'Symbol assigned to Board successfully' }, ...board);
      } else {
        res.status(400).json({ error: 'Model name must be either Board or Card.' })
      }
      
    } catch (error) {
      console.error('Error assigning symbol to element:', error.message);
      res.status(500).json({ error: 'Failed to assign symbol to element' });
    }
  },
}
router.post('/new', post.new);
router.post('/', post.assign);
router.get('/search', get.search);
router.get('/', get.all)
router.get('/:symbolId', get.one);

module.exports = router;