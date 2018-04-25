module.exports = {
    API_END_POINT: '/api/v1',
    BITCOINADDRESS : '(?:[13][1-9A-Za-z][^O0Il]{24,32})',
    PRIVATEKEY : '([1-9A-Za-z][^OIl]){20,50}',
    BLOCKCYPHER_URL_TESTNET: 'https://api.blockcypher.com/v1/btc/test3',
    BLOCKCYPHER_URL_LIVENET: 'https://api.blockcypher.com/v1/btc/main',
    EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    JWT_SECRET: 'LMn5DUCNvrK59teDODQxJg8lZinMj8325Blxp6rlQ'
}