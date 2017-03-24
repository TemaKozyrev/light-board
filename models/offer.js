var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var offerSchema = new Schema({
    title: {
        type: String,
        required: [true, 'required']
    },
    ShortDescription: {
        type: String,
        required: [true, 'required']
    },
    description: {
        type: String,
        required: [true, 'required']
    },
    _userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    _categoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    imgUrl: String,
    status: Boolean
});

var Offer = mongoose.model('Offer', offerSchema);

module.exports = {
    Offer: Offer,
    offerSchema: offerSchema
};