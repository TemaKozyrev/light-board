var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Offer = require('../models/offer').Offer;
var Category = require('../models/category');
var verifyToken = require('../middleware/verifyToken');
var router = express.Router();
multer = require('multer');
var _ = require('lodash');

var upload = multer({
    dest: __dirname + '/../public/uploads/'
});

router.get('/register', function (req, res) {
    res.render('registration')
});

router.post('/register', upload.single('avatar'), function (req, res) {
    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatarUrl: req.file.filename
    });

    user.save(function (err) {
        if (err) {
            return res.redirect('/account/register');
        } else {
            verifyToken.createVerificationToken(user, req)
        };

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    })
});

router.get('/login', function (req, res) {
    res.send('login');
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (!user) {
            res.redirect(req.get('referer'));
        }
        req.logIn(user, function (err) {
            res.redirect(req.get('referer'));
        });
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get("/verify/:token", function (req, res, next) {
    var token = req.params.token;
    verifyToken.verifyUser(token, function (err) {
        if (err) return res.send("verification-failure");
        res.send("verification-success");
    });
});

router.post('/changepass', function (req, res) {
    if (req.isAuthenticated()) {
        User.findOne({ username: req.user.username }, function (err, user) {
            user.comparePassword(req.body.oldpass, function (err, isMatch) {
                if (isMatch) {
                    user.password = req.body.newpass;
                    user.save();
                    res.redirect('/account/profile/?valid=' + true)
                } else {
                    res.redirect('/account/profile/?valid=' + false)
                }
            })
        });
    }
});

router.get('/info', function (req, res) {
    if (req.isAuthenticated()) {
        res.send(req.user.username);
    } else {
        res.send('not auth');
    }
});

router.get('/profile', function (req, res) {
    if (req.isAuthenticated()) {
        var valid;
        if (_.isEmpty(req.query) == false) {
            if (req.query.valid == 'true') {
                valid = true;
            } else if (req.query.valid == 'false') {
                valid = false;
            }
        } else {
            valid = null;
        }
        Category.find().select('name').exec(function (err, category) {
            Offer.find({_userId: req.user._id}).exec(function (err, offers) {
                res.render('profile', {valid: valid, cat: category, offers: offers});
            });
        });
    } else {
        res.redirect('/account/register')
    }
});

module.exports = router;