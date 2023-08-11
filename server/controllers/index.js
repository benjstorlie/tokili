const router = require('express').Router();

const api = require('./api');
// const renderPages = require('./renderPages');

// router.use('/', renderPages);
router.use('/api', api);

module.exports = router;