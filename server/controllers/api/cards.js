const router = require('express').Router();
const { Card } = require('../../models');

router.route('/')
  .post(post.new)
  .get(get.all);

router.route('/:cardId')
  .get(get.one)
  .put(put.update)


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

module.exports = router;