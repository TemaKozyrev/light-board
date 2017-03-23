var verificationTokenModel = require('../models/token');
var userModel = require('../models/user');
var nodemailer = require('nodemailer');

var verifyUser = function(token, done) {
    verificationTokenModel.findOne({token: token}, function (err, doc){
        if (err) return done(err);
        userModel.findOne({_id: doc._userId}, function (err, user) {
            if (err) return done(err);
            user["verified"] = true;
            user.save(function(err) {
                done(err);
            })
        })
    })
};

var createVerificationToken = function (user, req) {
    var verificationToken = new verificationTokenModel({_userId: user._id});
    verificationToken.createVerificationToken(function (err, token) {
        if (err) return console.log("Couldn't create verification token", err);
        var message = {
            email: user.email,
            name: user.name,
            verifyURL: "http://" + req.get('host') + "/account/verify/" + token};
        sendVerificationEmail(message, function (error, success) {
            if (error) {
                // not much point in attempting to send again, so we give up
                // will need to give the user a mechanism to resend verification
                console.error("Unable to send via postmark: " + error.message);
                return;
            }
            console.info("Sent to postmark for delivery")
        });
    });
};

var sendVerificationEmail = function (message, done) {
    var transporter = nodemailer.createTransport({
        service: 'yandex',
        auth: {
            user: 'ambaproject@tema.ws',
            pass: 'ambaproj'
        }
    });
    var mailOptions = {
        from: '<ambaproject@tema.ws>',
        to: message.email,
        subject: 'Hello',
        text: message.verifyURL
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    })
};

module.exports = {
    verifyUser: verifyUser,
    createVerificationToken: createVerificationToken
};