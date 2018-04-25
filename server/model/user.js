
var mongoose = require('mongoose');
const constant = require('./../config/constant');
const errorMsg = require('./../util/errorMessages.json');

var userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        validate: {
            validator: function (text) {
                let emailRegex = constant.EMAIL_REGEX;
                return emailRegex.test(String(text).toLowerCase());
            },
            message: errorMsg.user.email
        },
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    btc: String
});

var User = mongoose.model('User', userSchema);
module.exports = User;