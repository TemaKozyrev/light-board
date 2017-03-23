var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var offerSchema = new Schema({ //TODO extend offerSchema
    title: String,
    description: String,
    status: Boolean
});

var Offer = mongoose.model('Offer', offerSchema);

module.exports = {
    Offer: Offer,
    offerSchema: offerSchema
};