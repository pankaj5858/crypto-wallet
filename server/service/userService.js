var User = require('./../model/user');
var errorMsg = require('./../util/errorMessages.json');
var constant = require('./../config/constant');

var shared = {};
var __private = {};

shared.get = function (userId, cb){
    User.findOne({_id: userId},{password:0}, function(error, user){
        if(error || !user){
            cb(error || "User not found");
        } else {
            cb(null, user);
        }
    });
}

shared.update = function (user, cb){
    let id = user.id;
    delete user["id"];
    User.update({_id: id}, user, function(error, user){
        if(error ){
            cb(error);
        } else {
            cb(null, user);
        }
    });
}

module.exports = shared;