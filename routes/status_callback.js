'use strict';

var config = require('../config');
var twilio = require('twilio');
var client = twilio(config.accountSid, config.authToken);
var fallbackCall = require('../lib/fallBackCall');

module.exports = function(app) {
  app.post('/StatusCallBack/:firstName/:lastName/:phoneNumber', function(req, res) {
    if ((req.body.AnsweredBy === 'machine') || (req.body.CallStatus === 'canceled' || 'failed' || 'no-answer')) {
      client.calls(req.body.CallSid).update({
        status: 'canceled'
      }, function(err, call) {
        if (err) console.log('error canceling call');
        console.log(call.direction);
        fallbackCall.makeCall(req.params.firstName, req.params.lastName, req.params.phoneNumber);
        res.type('text/xml');
        res.render('hangup');
      });
    }
  });
};
