const router = require('express').Router();
const { Board, Card, User, Symbol } = require('../../models');

// Scroll to the end to see the routes

const get = {
  async all(req,res) {
    try {
      const boardData = await Board.findAll({
        include: [
          { model: Symbol, attributes: [ 'image_url' ]},
          { model: User, attributes: [ 'username' ]},
        ]
      });

      if (!boardData.length) {
        res.status(404).json({ error: 'No boards found.' })
      } else {
        res.json(boardData);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async one(req,res) {
    try {
      const board_id = req.params.boardId;
      const boardData = await Board.findByPk( board_id, {
        include: [
          { model: User, attributes: [ 'username' ]},
          { model: Symbol, attributes: {include: [ 'image_url' ]}},
          { model: Card},
          // { model: Card, where: {kind: 'card'}, as: 'cards'},
        ]
      });

      if (!boardData) {
        res.status(404).json({ error: 'No boards found.' })
      } else {
        res.json(boardData);
      }


    } catch (err) {
      res.status(500).json(err);
    }
  }
}

const post = {
  async new(req, res) {
    try {
      const board = await Board.create({
        title: req.body.title || '', 
        user_id: req.session.user_id,
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

      const origBoard = await Board.findByPk(board_id, {
        include: [
          { model: Card},]
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

      // create new cards, associated by the newBoard's id
      const cards = await Card.bulkCreate(
        origBoard.cards.map( 
          card => ({
            board_id: newBoard.id,
            ...card
          })
        )
      );

      res.json(...newBoard, cards);


    } catch (err) {
      res.status(500).json(err);
    }
  },

  // '/boards/:boardId/addCard'
  // same result as post to '/cards/' with body {board_id: boardId}
  // new blank card
  async addCard(req,res) {
    try {
      const card = await Card.create({ board_id: req.params.boardId, ...req.body });
      
      card
        ? res.json(card)
        : res.status(500).json({error: 'Could not add card.'})

    } catch (err) {
      res.status(500).json(err)
    }
  },

  // '/boards/:boardId/addHeading'
  // same result as post to '/cards/' with body {board_id: boardId, kind: 'heading'}
  // new blank card
  async addHeading(req,res) {
    try {
      const [heading, created] = await Card.findOrCreate(
        { 
          where: { board_id: req.params.boardId, kind: 'heading'},
          defaults: { ...req.body }
        }
      );
      
      card
        ? res.json(card)
        : res.status(500).json({error: 'Could not add card.'})

    } catch (err) {
      res.status(500).json(err)
    }
  },
}

const put = {
  // '/boards/:boardId'
  async update(req, res) {
    try {
      const board_id = req.params.boardId;
  
      const board = await Board.update( req.body ,{where: {id: board_id}});
      res.status(200).json(board);

    } catch (error) {
      console.error('Error updating board:', error.message);
      res.status(500).json({ error: 'Failed update board.' });
    }    
  },
  // '/boards/:boardId/reorder'
  async reorderCards(req,res) {
    // make sure hidden cards and heading have order null
    // and make sure shown cards have unique integer orders.
  }
}

const del = {
  // '/boards/:boardId'
  async one(res,req) {

  },

  // '/boards/:boardId/hiddenCards'
  async hiddenCards(res, req) {

  },
}


router.post('/', post.new);
router.get('/', get.all);

router.get('/:boardId', get.one);
router.put('/:boardId', put.update);

router.post('/:boardId/copy', post.copy);
router.post('/:boardId/addCard', post.addCard);
router.post('/:boardId/addHeading', post.addHeading);

module.exports = router;