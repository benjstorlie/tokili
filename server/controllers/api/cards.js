const router = require('express').Router();
const { Card , Symbol , Board } = require('../../models');

// Scroll to the end to see the routes


const get = {
  async all(req,res) {
    try {

      const cardData = await Card.findAll({ 
        include: [
          {model: Board},
          {model: Symbol}
        ]
      })

      if (!cardData.length) {
        res.status(404).json({error: 'No cards found.'})
        return
      }

      res.json(cardData);

    } catch (err) {
      res.status(500).json(err);
    }
  },

  // '/cards/:cardId'
  async one(req,res) {
    try {
      const cardData = await Card.findByPk( req.params.cardId, {
        include: [
          {model: Board},
          {model: Symbol}
        ]
      });

      if (!cardData) {
        res.status(404).json({error: 'Could not find card.'})
        return
      }

      res.json(cardData)

    } catch (err) {
      res.status(500).json(err);
    }
  }
}

const post = {
  async new(req, res) {
    try {
      const card = await Card.create({
        board_id: req.body.board_id,
      });
  
      res.status(200).json(card);
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

const del = {
  async one(req, res) {
    try {
      await Card.destroy({where: {id: req.params.cardId}});
      res.json({success: true})
    } catch (err) {
      res.status(500).json(err)
    }
  }
}

router.post('/', post.new);
router.get('/', get.all);

router.get('/:cardId', get.one);
router.put('/:cardId', put.update);
router.delete('/:cardId', del.one);

module.exports = router;