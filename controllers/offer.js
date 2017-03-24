var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var User = require('../models/user');
multer = require('multer');

var upload = multer({
    dest: __dirname + '/../public/uploads/'
});

router.post('/create', upload.single('image'), function (req, res) {
    if (req.isAuthenticated()) {
        Category.findOne({name: req.body.catname}, function (err, cat) {
            if (err) {
                res.redirect('/account/profile')
            } else {
                cat.offers.push({
                    title: req.body.oname,
                    ShortDescription: req.body.sdesc,
                    description: req.body.desc,
                    _userId: req.user._id,
                    _categoryId: cat._id,
                    imgUrl: req.file.filename,
                    status: true
                });
                req.user.offers.push({
                    title: req.body.oname,
                    ShortDescription: req.body.sdesc,
                    description: req.body.desc,
                    _userId: req.user._id,
                    _categoryId: cat._id,
                    imgUrl: req.file.filename,
                    status: true
                });
                cat.save();
                req.user.save();
                res.redirect('/account/profile');
            }
        })
    } else {
        res.redirect('/account/register')
    }
})

module.exports = router;