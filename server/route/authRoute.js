var authController = require('./../controller/authController');
var constant = require('./../config/constant');
const AUTH_END_POINT = '/auth';

function AuthRoute(app){
    app.post(constant.API_END_POINT + AUTH_END_POINT + '/register', authController.register);
    app.post(constant.API_END_POINT + AUTH_END_POINT + '/login', authController.login);
}

module.exports = AuthRoute;