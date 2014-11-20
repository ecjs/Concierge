'use strict';

var config = require('../config');
var twilio = require('twilio');
var client = twilio(config.accountSid, config.authToken);

module.exports = function(app) {
  app.post('/StatusCallBack/:firstName/:lastName/:phoneNumber', function(req, res) {
    if (req.body.AnsweredBy === 'machine') {
      client.makeCall({
        to: req.params.phoneNumber,
        from: config.twilioNumber,
        // statusCallback: process.env.URL + '/StatusCallBack/' + req.params.firstName + '/' + req.params.lastName + '/' + req.params.phoneNumber,
        statusCallbackMethod: 'POST',
        ifMachine: 'Hangup',
        url: process.env.URL + '/outboundMachine/' + req.params.firstName + '/' + req.params.lastName + '/'
      }, function(err) {
        console.log(err);
        if (err) {
          console.log('error making a call: ' + err);
        }
        else {
          res.status(200).json({msg: 'call made'});
          console.log('Secondary call successfully made!');
        }
      });
    }
  });
};
