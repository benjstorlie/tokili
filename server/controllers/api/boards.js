const router = require('express').Router();
const { Board, Card, User, Symbol } = require('../../models');

router.route('/')
  .post(post.new)
  .get(get.all);

router.route('/:boardId')
  .get(get.one)
  .put(put.update)

router.post('/:boardId/copy', post.copy)

router.put('/:boardId/symbol', put.assignBoardSymbol);

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
          { model: Symbol, attributes: [ 'image_url' ]},
          { model: Card, as: 'card' },
          { model: Card, as: 'heading' }
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
      const { title } = req.body;
      const board = await Board.create({
        title, 
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
}

module.exports = router;