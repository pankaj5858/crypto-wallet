
var jwt = require('jsonwebtoken');
var constant = require('./../config/constant');

module.exports = function (req, res, next) {

    var token = req.header('Authorization');
    if(!token){
        res.status(401).send({message: "Unauthorised"});
    } else {
        jwt.verify(token, constant.JWT_SECRET, function(err, decoded) {
            if (err) {
                res.status(401).send({message: "Unauthorised"});
            } else {
                req.loggedUserId = decoded.id;
                next();
            }
        });
    }
}