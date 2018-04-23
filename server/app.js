var express = require('express'),
cors = require('cors'),
bodyParser = require('body-parser');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var config = require('./server/config/config');
var conf = new config().get();
var t = new config();
var DB = require('./server/config/db');
var dbInfo = new DB(conf.db);

var Route = require('./server/route/index');
new Route(app);

app.listen(conf.port, () => console.log('Application listening on port !' + conf.port));


