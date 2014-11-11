var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');

var app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

require('./routes/index')(app);
require('./routes/call')(app);
require('./routes/register_user')(app);
require('./routes/register_concierge')(app);

var port = process.env.PORT || 3000;

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(port);
console.log('Concierge magic starts here..on port: ' + port);
