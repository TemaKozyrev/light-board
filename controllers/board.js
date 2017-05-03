var express = require('express');
var router = express.Router();
var collectOffers = require('../middleware/collectOffers').collectOffers;
var Category = require('../models/category');

router.get('/:category', function (req, res) {
    collectOffers(req.params.category, function (result) {
        if (result == null)
            res.redirect('/');
        else
            res.render('board', result)
    })
});

router.post('/create/category', function (req, res) {
    console.log(req.body);
    var newCategory = new Category({
        name: req.body.name,
        shortName: req.body.shortName,
        offers: []
    });
    newCategory.save(function(err, resp) {
        if (err) {
            console.log(err);
            res.send({
                message: 'something went wrong'
            });
        } else {
            res.redirect('/account/profile');
        }

    });
    
});

module.exports = router;