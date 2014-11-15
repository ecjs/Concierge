var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var config = require('./config');
var twilio = require('twilio');
var mongoose = require('mongoose');
var passport = require('passport');
var authController = require('./lib/auth.js');
var CronJob = require('cron').CronJob;
var jobManager = require('./lib/jobManager');

var app = express();
var client = twilio(config.accountSid, config.authToken);

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.set('jwtSecret', process.env.JWT_SECRET || 'thisisnotreallyasecretmorelikeaterces');
app.use(passport.initialize());
app.set('view engine', 'jade');
var jwtauth = require('./lib/jwt_auth')(app.get('jwtSecret'));
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/concierge_dev');

require('./routes/index')(app);
require('./routes/call')(app);
require('./routes/register_user')(app);
require('./routes/register_concierge')(app, jwtauth);
require('./routes/job')(app, jwtauth);
require('./routes/confirm_user')(app, jwtauth);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(config.port);

console.log('Concierge magic starts here..on port: ' + config.port);

new CronJob('0 * * * * *', function() {
  jobManager.checkJobs();
}, null, true, "America/Los_Angeles");
