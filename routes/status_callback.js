'use strict';

var config = require('../config');
var twilio = require('twilio');
var client = twilio(config.accountSid, config.authToken);
var fallbackCall = require('../lib/fallBackCall');

module.exports = function(app) {
  app.post('/StatusCallBack/:firstName/:lastName/:phoneNumber', function(req, res) {
    if ((req.body.AnsweredBy === 'machine') || (req.body.CallStatus === 'canceled' || 'failed' || 'no-answer')) {
      client.calls(req.body.CallSid).update({
        status: 'completed'
      }, function(err, call) {
        console.log(call.direction);
        res.status(200).send('success');
        fallbackCall.makeCall(req.params.firstName, req.params.lastName, req.params.phoneNumber);
      });
    }
  });
};
