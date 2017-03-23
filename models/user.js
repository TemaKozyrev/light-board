var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt-nodejs');
var offerSchema = require('./offer').offerSchema;
var Schema = mongoose.Schema;

userSchema = new Schema({   //TODO extend(check) userSchema
    username: {
        type: String,
        index: true,
        unique: true,
        lowercase: true,
        required: [true, 'required']
    },
    email: {
        type: String,
        index: true,
        unique: true,
        lowercase: true,
        required: [true, 'required']
    },
    verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    avatarUrl: {
        type: String
    },
    offer: [offerSchema]
});

userSchema.pre('save', function (next) {
    var user = this;
    var SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
