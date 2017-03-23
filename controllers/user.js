// Load required packages
var express = require('express');
var passport = require('passport');
var User = require('../models/user');
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
            return res.redirect('/account/register', {err: err});
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
            return res.redirect('/')
        };
        req.logIn(user, function (err) {
            return res.redirect('/')
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
    };
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
        if (_.isEmpty(req.query) == false) {
            if (req.query.valid == 'true') {
                res.render('profile', {valid: true});
            } else if (req.query.valid == 'false') {
                res.render('profile', {valid: false});
            }
        } else {
            res.render('profile', {valid: null});
        }
    } else {
        res.redirect('/account/register')
    }
});

module.exports = router;