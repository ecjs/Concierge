'use strict';

var config = require('../config');
var twilio = require('twilio');
var client = twilio(config.accountSid, config.authToken);

module.exports = function(app) {
  app.post('/StatusCallBack', function(req) {
    console.log('whoop! status callback: ' + req.body.AnsweredBy);
  });
};
