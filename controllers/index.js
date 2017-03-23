var express = require('express');

var router = express.Router();

/* test router */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.use('/account', require('./user'));


module.exports = router;
