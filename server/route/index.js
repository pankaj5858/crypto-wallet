var WalletBtcRoute = require('./walletBtcRoute');
var UserRoute = require('./userRoute');
var AuthRoute = require('./authRoute');

function Route(app) {
    new WalletBtcRoute(app);
    new UserRoute(app);
    new AuthRoute(app);
}
module.exports = Route;