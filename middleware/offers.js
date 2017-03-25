var Category = require('../models/category');
var Offer = require('../models/offer').Offer;
var User = require('../models/user');

var createOffer = function (catname, offer, user, file, callback) {
    Category.findOne({name: catname}, function (err, cat) {
        if (err) {
            callback()
        } else {
            var newOffer = new Offer({
                title: offer.oname,
                ShortDescription: offer.sdesc,
                description: offer.desc,
                _userId: user._id,
                _categoryId: cat._id,
                imgUrl: file,
                status: true
            });
            newOffer.save();
            cat.offers.push({
                _offerId: newOffer._id
            });
            user.offers.push({
                _offerId: newOffer._id
            });
            cat.save();
            user.save();
            callback();
        }
    })
};

var deleteOffer = function (offer_id, user, callback) {
    Offer.findOne({_id: offer_id}, function (err, offer) {
        if (offer._userId.toString() == user._id.toString()) {
            User.findOneAndUpdate({'_id': user._id},
                { $pull: {"offers": {_offerId: offer._id} } },
                function () {
                    Category.findOneAndUpdate({'_id': offer._categoryId},
                        {$pull: {"offers": {_offerId: offer._id } } },
                        function () {
                            offer.remove();
                            offer.save();
                            callback();
                        })
                });
        }
    })
};

module.exports = {
    createOffer: createOffer,
    deleteOffer: deleteOffer
}