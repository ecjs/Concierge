'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var mongoose = require('mongoose');
var passport = require('passport');
var CronJob = require('cron').CronJob;
var jobManager = require('./lib/jobManager.js');

var app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.set('jwtSecret', process.env.JWT_SECRET || 'thisisnotreallyasecretmorelikeaterces');
app.use(passport.initialize());
app.set('view engine', 'jade');
var jwtauth = require('./lib/jwt_auth')(app.get('jwtSecret'));
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/concierge_dev');

require('./routes/index')(app);
require('./routes/call')(app);
require('./routes/status_callback')(app);
require('./routes/register_user')(app);
require('./routes/register_concierge')(app, jwtauth);
require('./routes/job')(app, jwtauth);
require('./routes/confirm_user')(app, jwtauth);
require('./routes/resendConfirmation')(app, jwtauth);
require('./routes/change_password')(app, jwtauth);
require('./routes/change_phone')(app, jwtauth);
require('./routes/change_username')(app, jwtauth);
require('./routes/user')(app, jwtauth);
require('./routes/password_reset')(app);
require('./routes/concierge_jobs')(app, jwtauth);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(config.port);

console.log('Concierge magic starts here..on port: ' + config.port);

var jobCheckCron = new CronJob('0 * * * * *', function() {
  jobManager.checkJobs();
  console.log('Checking jobs to move to the Queue');
}, null, false, 'America/Los_Angeles');

var jobQueueCheckCron = new CronJob('0 * * * * *', function() {
  jobManager.checkQueue();
  console.log('Checking jobs to send to Twilio');
}, null, false, 'America/Los_Angeles');
jobCheckCron.start();
jobQueueCheckCron.start();
