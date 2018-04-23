var WalletBtcRoute = require('./walletBtcRoute');

function Route(app) {
    new WalletBtcRoute(app);
}
module.exports = Route;