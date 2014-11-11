var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var config = require('./config');
var twilio = require('twilio');

var app = express();
var client = twilio(config.accountSid, config.authToken);
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'jade');

require('./routes/index')(app);
require('./routes/call')(app);
require('./routes/register_user')(app);
require('./routes/register_concierge')(app);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(config.port);

console.log('Concierge magic starts here..on port: ' + config.port);
