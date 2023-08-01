const router = require('express').Router();
const { Board, User} = require('../../models');

router.post('/', async (req, res) => {
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

  async copy(req,res) {
    try {
      const { title , boardId } = req.body;

      const origBoard = Board.findByPk(boardId, {
        include: [
          { model: Card, as: 'heading' }, // Alias 'heading' represents the "hasOne" association
          { model: Card, as: 'card' }, // Alias 'card' represents the "hasMany" association
        ],
      });
      if (!origBoard) {
        res.status(404).json({message: 'Board not found.'});
        return;
      }
      const newBoard = await Board.create({
        title: title || origBoard.title + ' copy',
        userId: req.session.userId,
      })
      
      const heading = await Card.create({
        title: origBoard.heading.title,
        
      })

    } catch (err) {
      res.status(500).json(err);
    }
  }
}

const put = {
  async update(req, res) {
    try {

    } catch (err) {
      res.status(500).json(err);
    }    
  }
}