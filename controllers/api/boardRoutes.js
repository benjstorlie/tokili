const router = require('express').Router();
const { Board, User} = require('../../models');

router.post('/', async (req, res) => {
  try {
    const {title, body, tagIds} = req.body;
    const blogpost = await Blogpost.create({
      title,
      body,
      userId: req.session.userId,
    });

    const tags = await Tag.findAll({where: {id: tagIds}});

    if (tags.length != tagIds.length) {
      res
        .status(404)
        .json({ message: `Some tag ids were not found.` });
      return;
    }

    await blogpost.setTags(tags);
    await blogpost.save()

    res.status(200).json(blogpost);
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
  async new(req,res) {
    try {
      const { title } = req.body;

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
        res.status(404).json({message: 'Board not found.'})
      }

      

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