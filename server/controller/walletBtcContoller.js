var walletBtcService = require('./../service/walletBtcService');

var shared = {};
shared.transaction = {};
shared.wallet = {};

shared.transaction.send = function (req, res){
    var trs = req.body.transaction;
    walletBtcService.transaction.send(trs, function(error, response){
        if(error){
            res.status(400).send({'message': response});
        } else {
            res.send({'message': 'Transaction success', data: response});
        }
    })
}

shared.transaction.get = function (req, res){
    var trsId = req.params.transactionId;
    walletBtcService.transaction.get(trsId, function(error, response){
        if(error) {
            res.status(400).send({message:error});
        } else {
            res.send({'message': 'Transaction success', data: response});
        }
    })
}

shared.wallet.generate = function (req, res){
    walletBtcService.wallet.generate(function(error, response){
        res.send({'message': 'New address', data: response});
    })
}

shared.wallet.info = function (req, res){
    walletBtcService.wallet.info(req.params.address,function(error, response){
        if(error) {
            res.status(400).send({message:error});
        } else {
            res.send({'message': 'Wallet success', data: response});
        }
    })
}

module.exports = shared;