var express = require('express');
var router = express.Router();
var collectOffers = require('../middleware/collectOffers');

router.get('/:category', function (req, res) {
    collectOffers(req.params.category, function (result) {
        if (result == null)
            res.redirect('/');
        else
            res.render('board', result)
    })
});

module.exports = router;