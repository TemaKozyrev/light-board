var mongoose = require('mongoose');
var offerSchema = require('./offer').offerSchema;

var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    shortName: String,
    offers: [offerSchema]
});

categorySchema.pre('save', function (next) {
    var category = this;

    if (!category.isModified('name')) return next();

    category.shortName = category.name.replace(/\s/g, '').replace(/\//g,  '-').toLowerCase();
    next();
});

module.exports = mongoose.model('Category', categorySchema);