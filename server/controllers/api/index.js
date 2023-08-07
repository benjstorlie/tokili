const router = require('express').Router();

const users = require('./users');
const boards = require('./boards');
const cards = require('./cards');
const symbols = require('./symbols');

router.use('/users', users);
router.use('/boards', boards);
router.use('/cards', cards);
router.use('/symbols', symbols);

module.exports = router;