'use strict';

var config = require('../config');
var twilio = require('twilio');
var client = twilio(config.accountSid, config.authToken);

module.exports = function(app) {
  app.post('/call', function(req, res) {
    console.log(req.body.phoneNumber);
    client.makeCall({
      to: req.body.phoneNumber,
      from: config.twilioNumber,
      StatusCallBack: process.env.URL + '/StatusCallBack',
      url: process.env.URL + '/outbound'
    }, function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({
          message: 'Thank you! We will be calling you shortly.'
        });
      }
    });
  });

  app.post('/outbound/:firstName/:lastName/:phoneNumber/', function(req, res) {
    console.log('twilio request: ' + req.body.CallSid);
    res.type('text/xml');
    res.render('outbound', {firstName: req.params.firstName, lastName: req.params.lastName, phoneNumber: req.params.phoneNumber});
  });
  app.post('/outboundNoConcierge/:firstName/:lastName/', function(req, res) {
    console.log('twilio request:' + req.body.CallSid);
    res.type('text/xml');
    res.render('outboundNoConcierge', {firstName: req.params.firstName, lastName: req.params.lastName});
  });
  app.post('/outboundMachine/:firstName/:lastName/', function(req, res) {
    console.log('twilio request:' + req.body.CallSid);
    res.type('text/xml');
    res.render('outboundMachine', {firstName: req.params.firstName, lastName: req.params.lastName});
  });
  app.post('/tryCallAgain/:firstName/:lastName/:phoneNumber', function(req, res) {
    console.log('twilio request:' + req.body.DialCallStatus);
    res.type('text/xml');
    res.render('tryCallAgain', {firstName: req.params.firstName, lastName: req.params.lastName, phoneNumber: req.params.phoneNumber});
  });
};
