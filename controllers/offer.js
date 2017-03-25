var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Offer = require('../models/offer').Offer;
var User = require('../models/user');
multer = require('multer');
var _ = require('lodash');
var createOffer = require('../middleware/offers').createOffer;
var deleteOffer = require('../middleware/offers').deleteOffer;

var upload = multer({
    dest: __dirname + '/../public/uploads/'
});

router.post('/create', upload.single('image'), function (req, res) {
    if (req.isAuthenticated()) {
        createOffer(req.body.catname,
            {oname: req.body.oname, sdesc: req.body.sdesc, desc: req.body.desc},
            req.user,
            req.file.filename,
            function () {
            res.redirect('/account/profile')
        });
    } else {
        res.redirect('/account/register')
    }
});

router.get('/delete', function (req, res) {
    if (req.isAuthenticated()) {
        if (_.isEmpty(req.query) == false) {
            deleteOffer(req.query.offer_id, req.user, function () {
                res.redirect('/account/profile');
            });
        } else {
            res.redirect('/account/profile')
        }
    } else {
        res.redirect('/account/register')
    }
});

module.exports = router;