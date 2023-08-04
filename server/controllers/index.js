const router = require('express').Router();

const api = require('./api');
// const renderPages = require('./renderPages');

// router.use('/', renderPages);
router.use('/api', api);


// 404 error page
router.get('*', async (req, res) => {
  res.render('errorpage', {
    message: "404 Page not found",
    logged_in: req.session.logged_in
    })
})

module.exports = router;