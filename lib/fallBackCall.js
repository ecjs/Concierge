'use strict';

var config = require('../config');
var twilio = require('twilio');
var client = twilio(config.accountSid, config.authToken);

exports.makeCall = function(first, last, phone) {
  client.makeCall({
    to: phone,
    from: config.twilioNumber,
    // statusCallback: process.env.URL + '/StatusCallBack/' + req.params.firstName + '/' + req.params.lastName + '/' + req.params.phoneNumber,
    // statusCallbackMethod: 'POST',
    IfMachine: 'Hangup',
    url: process.env.URL + '/outboundMachine/' + first + '/' + last + '/'
  }, function(err) {
    console.log(err);
    if (err) {
      console.log('error making a call: ' + err);
    }
    else {
      console.log('Secondary call successfully made!');
    }
  });
};
