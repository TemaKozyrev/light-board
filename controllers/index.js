var express = require('express');

var router = express.Router();

/* test router */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.use('/account', require('./user'));
router.use('/offer', require('./offer'));

module.exports = router;
