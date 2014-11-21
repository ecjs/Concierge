'use strict';

// var config = require('../config');
// var twilio = require('twilio');
// var client = twilio(config.accountSid, config.authToken);
// var fallbackCall = require('../lib/fallBackCall');

module.exports = function(app) {
  app.post('/StatusCallBack/:firstName/:lastName/:phoneNumber', function(req, res) {
    if ((req.body.AnsweredBy === 'machine') || (req.body.CallStatus === 'canceled' || 'failed' || 'no-answer')) {
      res.type('text/xml');
      res.render('hangup', {firstName: req.params.firstName, lastName: req.params.lastName, phoneNumber: req.params.phoneNumber});
    }
    console.log('call status is: ' + req.body.CallStatus);
  });
};
