var authService = require('./../service/authService');
var errorMsg = require('./../util/errorMessages.json');
var shared = {};

shared.register = function (req, res){
    authService.register(req.body.user, function(err, result){
        if(err){
            res.status(400);
            result = err;
        }
        res.send(result);
    })
}

shared.login = function (req, res){
    authService.login(req.body.user, function(err, result){
        if(err){
            var status = (err == errorMsg.user.invalidPassword)?401:400;
            res.status(status);
            result = err;
        }
        res.send(result);
    })
}

module.exports = shared;