const router = require('express').Router();
const { Card } = require('../../models');

// Scroll to the end to see the routes


const get = {
  async all(req,res) {
    try {

      const cardData = Card.findAll()

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
      const board = await Card.create({
        board_id: req.body.board_id,
        user_id: req.session.user_id,
      });
  
      res.status(200).json(board);
    } catch (err) {
      res.status(500).json(err);
    }
  },
}

const put = {
  // '/cards/:cardId'
  async update(req, res) {
    try {
      const card_id = req.params.cardId;
  
      const card = await Card.update( req.body ,{where: {id: card_id}});
      res.status(200).json(card);

    } catch (error) {
      console.error('Error updating card:', error.message);
      res.status(500).json({ error: 'Failed update card.' });
    }    
  },
}

router.post('/', post.new);
router.get('/', get.all);

router.get('/:cardId', get.one);
router.put('/:cardId', put.update);

module.exports = router;