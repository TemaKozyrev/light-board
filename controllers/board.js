var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Offer = require('../models/offer').Offer;

router.get('/:category', function (req, res) {
    var categoryName = req.params.category;
    Category.findOne({shortName: categoryName}, function (err, category) {
        if (category == null)
            res.redirect('/');
        else {
            Offer.find({_categoryId: category._id}, function (err, offers) {
                res.render('board', {offers: offers})
            })
        }
    })
});

module.exports = router;