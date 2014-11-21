'use strict';

// var config = require('../config');
// var twilio = require('twilio');
// var client = twilio(config.accountSid, config.authToken);
var fallbackCall = require('../lib/fallBackCall');

module.exports = function(app) {
  app.post('/StatusCallBack/:firstName/:lastName/:phoneNumber', function(req, res) {
    console.log('call status is: ' + req.body.CallStatus);
    if (req.body.CallStatus ===  'no-answer') {
      console.log('first call failed, time to try again.');
      res.type('text/xml');
      res.render('hangupMachine');
      fallbackCall.makeCall(req.params.firstName, req.params.lastName, req.params.phoneNumber);
    }
    console.log('call status is!: ' + req.body.CallStatus);
  });
};
