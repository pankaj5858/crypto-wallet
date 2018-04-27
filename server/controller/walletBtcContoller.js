var walletBtcService = require('./../service/walletBtcService');

var shared = {};
shared.transaction = {};
shared.wallet = {};

shared.transaction.send = function (req, res){
    var trs = req.body.transaction;
    walletBtcService.transaction.send(trs, function(error, response){
        if(error){
            res.status(400).send(error);
        } else {
            res.send(response);
        }
    })
}

shared.transaction.get = function (req, res){
    var trsId = req.params.transactionId;
    walletBtcService.transaction.get(trsId, function(error, response){
        if(error) {
            res.status(400).send({message:error});
        } else {
            res.send(response);
        }
    })
}

shared.wallet.generate = function (req, res){
    walletBtcService.wallet.generate(req.loggedUserId, function(error, response){
        res.send(response);
    })
}

shared.wallet.info = function (req, res){
    walletBtcService.wallet.info(req.loggedUserId,function(error, response){
        if(error) {
            res.status(400).send({message:error});
        } else {
            res.send(response);
        }
    })
}

module.exports = shared;