var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Offer = require('../models/offer').Offer;
var User = require('../models/user');
multer = require('multer');
var _ = require('lodash');

var upload = multer({
    dest: __dirname + '/../public/uploads/'
});

router.post('/create', upload.single('image'), function (req, res) {
    if (req.isAuthenticated()) {
        Category.findOne({name: req.body.catname}, function (err, cat) {
            if (err) {
                res.redirect('/account/profile')
            } else {
                newOffer = new Offer({
                    title: req.body.oname,
                    ShortDescription: req.body.sdesc,
                    description: req.body.desc,
                    _userId: req.user._id,
                    _categoryId: cat._id,
                    imgUrl: req.file.filename,
                    status: true
                });
                newOffer.save();
                cat.offers.push({
                    _offerId: newOffer._id
                });
                req.user.offers.push({
                    _offerId: newOffer._id
                });
                cat.save();
                req.user.save();
                res.redirect('/account/profile');
            }
        })
    } else {
        res.redirect('/account/register')
    }
});

router.get('/delete', function (req, res) {
    if (req.isAuthenticated()) {
        if (_.isEmpty(req.query) == false) {
            Offer.findOne({_id: req.query.offer_id}, function (err, offer) {
                if (offer._userId.toString() == req.user._id.toString()) {
                    User.findOneAndUpdate({'_id': req.user._id},
                        { $pull: {"offers": {_offerId: offer._id} } },
                        function () {
                            Category.findOneAndUpdate({'_id': offer._categoryId},
                                {$pull: {"offers": {_offerId: offer._id } } },
                                function () {
                                    offer.remove();
                                    offer.save();
                                    res.redirect('/account/profile');
                                })
                        });
                }
            })
        }
    }
});

module.exports = router;