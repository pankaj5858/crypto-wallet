
function Config(){}

Config.prototype.get = function(){
    var config = {};
    console.log(process.env.NODE_ENV, 'process.NODE_ENV')
    switch(process.env.NODE_ENV) {
        case 'testnet':{
            config.db = {
                url: 'mongodb://localhost/crypto-wallet'
            };
            config.port = 8080;

        }
    }
    return config;
}

module.exports = Config;
