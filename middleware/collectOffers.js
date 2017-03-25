var Category = require('../models/category');
var User = require('../models/user');
var Offer = require('../models/offer').Offer;
var async = require('async');

var collectOffers = function (category, callback) {
    Category.findOne({shortName: category}, function (err, category) {
        if (category == null)
            callback(null);
        else {
            Offer.find({_categoryId: category._id}, function (err, offers) {
                var newOffers = [];
                async.forEachOf(offers, function (value, key, callback) {
                    User.findById(value._userId, function (err, user) {
                        newOffers.push({
                            title: value.title,
                            ShortDescription: value.ShortDescription,
                            description: value.description,
                            imgUrl: value.imgUrl,
                            email: user.email
                        });
                        callback();
                    })
                }, function (err) {
                    callback({offers: newOffers, cat: category})
                })
            })
        }
    })
};

module.exports = collectOffers;