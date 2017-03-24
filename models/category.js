var mongoose = require('mongoose');
var offerSchema = require('./offer').offerSchema;

var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    offers: [offerSchema]
});

module.exports = mongoose.model('Category', categorySchema);