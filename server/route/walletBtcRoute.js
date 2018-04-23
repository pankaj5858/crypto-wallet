var walletBtcController = require('./../controller/walletBtcContoller');
var constant = require('./../config/constant');
const WALLET_END_POINT = '/wallet/btc';

function WalletBtcRoute(app){
    app.post(constant.API_END_POINT + WALLET_END_POINT + '/transactions', walletBtcController.transaction.send);
    app.get(constant.API_END_POINT + WALLET_END_POINT + '/transactions/:transactionId', walletBtcController.transaction.get);
    app.get(constant.API_END_POINT + WALLET_END_POINT , walletBtcController.wallet.generate);
    app.get(constant.API_END_POINT + WALLET_END_POINT + '/:address', walletBtcController.wallet.info);
}

module.exports = WalletBtcRoute;