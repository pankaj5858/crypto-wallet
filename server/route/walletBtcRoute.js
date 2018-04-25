var walletBtcController = require('./../controller/walletBtcContoller');
var constant = require('./../config/constant');
var auth = require('./../util/auth');
const WALLET_END_POINT = '/wallet/btc';

function WalletBtcRoute(app){
    app.post(constant.API_END_POINT + WALLET_END_POINT + '/transactions', auth, walletBtcController.transaction.send);
    app.get(constant.API_END_POINT + WALLET_END_POINT + '/transactions/:transactionId', auth, walletBtcController.transaction.get);
    app.get(constant.API_END_POINT + WALLET_END_POINT , auth,  walletBtcController.wallet.generate);
    app.get(constant.API_END_POINT + WALLET_END_POINT + '/address', auth, walletBtcController.wallet.info);
}

module.exports = WalletBtcRoute;