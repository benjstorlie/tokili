const router = require('express').Router();
const users = require('./users');
const boards = require('./boards');

router.use('/users', users);
router.use('/boards', boards);

module.exports = router;