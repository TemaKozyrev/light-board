var express = require('express');
var Category = require('../models/category');
var router = express.Router();

/* test router */
router.get('/', function(req, res, next) {
    Category.find().select('name shortName').exec(function (err, doc) {
        res.render('index', {cat: doc});
    });
});

router.use('/account', require('./user'));
router.use('/offer', require('./offer'));
router.use('/board', require('./board'));

module.exports = router;
