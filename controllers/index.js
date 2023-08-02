const router = require('express').Router();

const {router: apiRoutes} = require('./api');
const homeRoutes = require('./homeRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);


// 404 error page
router.get('*', async (req, res) => {
  res.render('errorpage', {
    message: "404 Page not found",
    logged_in: req.session.logged_in
    })
})

module.exports = router;