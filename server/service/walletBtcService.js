
var Promise = require('bluebird');
var request = require('request');
var bitcore = require('bitcore-lib');
var explorers = require('bitcore-explorers');

var constant = require('./../config/constant');
var userService = require('./../service/userService');

var shared = {};
var __private = {};
shared.transaction = {};
shared.wallet = {};
var blockcypherUrl = '';

__private.setNetwork = function (){
    bitcore.Networks.defaultNetwork = (process.env.NODE_ENV == 'testnet')?bitcore.Networks.testnet : bitcore.Networks.livenet; 
    blockcypherUrl = (process.env.NODE_ENV == 'testnet')?constant.BLOCKCYPHER_URL_TESTNET : constant.BLOCKCYPHER_URL_LIVENET;
}

__private.validateAddress = function(address){
    
    var _originIsAddress = _hasOrigin ? this.fromaddress.match(BITCOINADDRESS) : false;
}

__private.validateTransaction = function (transaction){
    if(!transaction.toaddress || !bitcore.Address.isValid(transaction.toaddress)){
        return 'Invalid receipient address';
    }
    if(!transaction.fromaddress || !bitcore.Address.isValid(transaction.fromaddress)){
        return 'Invalid sender address';
    }
    if(!transaction.privatekey){
        return 'Invalid sender private key';
    }
    if(!transaction.amount || isNaN(transaction.amount) || transaction.amount < 0){
        return 'Invalid amount';
    }
    return false;
}

__private.filterTransactions = function (walletResponse){
  let toBeReturn = {};
  if(!walletResponse){
    return {};
  }
  if(walletResponse.txs && walletResponse.txs.length > 0){
    let txs = [];
    for(var i = 0; i< walletResponse.txs.length; i++){
      let txToBeFilter = walletResponse.txs[i];
      let txsObj = {
        'block_hash': txToBeFilter.block_hash,
        'hash': txToBeFilter.hash,
        'block_height': txToBeFilter.block_height,
        'fee': txToBeFilter.fees,
        'confirmed': txToBeFilter.confirmed,
        'received': txToBeFilter.received,
        'double_spend': txToBeFilter.double_spend,
        'confirmations': txToBeFilter.confirmations,
        'sender': txToBeFilter.inputs[0].addresses[0],
        'recipient': txToBeFilter.outputs[0].addresses[0],
        'amount': txToBeFilter.outputs[0].value,
        'isSend': txToBeFilter.inputs[0].addresses.indexOf(walletResponse.address) != -1
      };
      txs.push(txsObj);
    }
    toBeReturn.txs = txs;
  }
  toBeReturn.total_received = walletResponse.total_received;
  toBeReturn.total_sent = walletResponse.total_sent;
  toBeReturn.balance = walletResponse.balance;
  toBeReturn.unconfirmed_balance = walletResponse.unconfirmed_balance;
  toBeReturn.final_balance = walletResponse.final_balance;
  return toBeReturn;
}

shared.transaction.send = function (transaction, cb) {
    __private.setNetwork();
    let txStatus = __private.validateTransaction(transaction);
    if(txStatus){
        cb(txStatus);
    } else {
        const unit = bitcore.Unit;
        const insight = new explorers.Insight();
        const minerFee = unit.fromMilis(0.128).toSatoshis(); //TODO calculate fee
        const transactionAmount = unit.fromMilis(transaction.amount).toSatoshis();
        
        insight.getUnspentUtxos(transaction.fromaddress, function(error, utxos) {
            if (error) {
              console.log('Error in Utxos : ', error);
              cb(error);
            } else {
              if (utxos.length == 0) {
                console.log("You don't have enough Satoshis to cover the miner fee.");
                cb("You don't have enough Satoshis to cover the miner fee.");
              } else {
                //get balance
              let balance = unit.fromSatoshis(0).toSatoshis();
              for (var i = 0; i < utxos.length; i++) {
                balance += unit.fromSatoshis(parseInt(utxos[i]['satoshis'])).toSatoshis();
              }
    
              console.log('transactionAmount: ' + transactionAmount);
              console.log('minerFee: ' + minerFee);
              console.log('balance: ' + balance);
    
              //check whether the balance of the address covers the miner fee
              if ((balance - transactionAmount - minerFee) > 0) {
    
                //create a new transaction
                try {
                  let bitcore_transaction = new bitcore.Transaction()
                    .from(utxos)
                    .to(transaction.toaddress, transactionAmount)
                    .fee(minerFee)
                    .change(transaction.fromaddress)
                    .sign(transaction.privatekey);
    
                  //handle serialization errors
                  if (bitcore_transaction.getSerializationError()) {
                    let error = bitcore_transaction.getSerializationError().message;
                    switch (error) {
                      case 'Some inputs have not been fully signed':
                        console.log('Please check your private key');
                        cb('Please check your private key');
                        break;
                      default:
                        console.log(error);
                        cb(error);
                    }
                  }
    
                  // broadcast the transaction to the blockchain
                  insight.broadcast(bitcore_transaction, function(error, body) {
                    if (error) {
                      console.log('Error in broadcast: ' + error);
                      cb(error);
                    } else {
                      cb(false, {transactionId: body});
                    }
                  });
                } catch (error) {
                  console.log(error.message);
                  cb(error.message);
                }
              } else {
                console.log("You don't have enough Satoshis to cover the miner fee.");
                cb("You don't have enough Satoshis to cover the miner fee.");
              }
              }
            }
          });
    }
}

shared.transaction.get = function (transactionId, cb) {
    __private.setNetwork();
    let url = blockcypherUrl + '/txs/' + transactionId;
    request(url, function(error, response, body) {
        if (error) {
          cb(error);
        }else if (response.statusCode !== 200) {
          cb('Error with '+response.statusCode + ' status');
        } else {
            cb(false, JSON.parse(body));
        }

    });
}

shared.wallet.generate = function (userId, cb) {
    __private.setNetwork();
    let walletInfo = {};
    walletInfo.privateKey = new bitcore.PrivateKey();
    walletInfo.address = walletInfo.privateKey.toAddress();
    let address = walletInfo.address.toString();
    let privateKey = walletInfo.privateKey.toString();
    userService.update({id: userId, btc: address}, function(err){
      cb(err, {'address': address, 'privatekey': privateKey});
    });
}

shared.wallet.info = function (userId, cb) {
    userService.get(userId, function(error, user){
      if(error){
        cb(error);
      } else {
        __private.setNetwork();
        let url = blockcypherUrl + '/addrs/' + user.btc + '/full';
        request(url, function(error, response, body) {
          if (error) {
            cb(error);
          }else if (response.statusCode !== 200) {
            cb('Error with '+response.statusCode + ' status');
          } else {
            cb(false, __private.filterTransactions(JSON.parse(body)));
          }

        });
      }
    });
}

module.exports = shared;