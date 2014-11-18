'use strict';

var config = require('../config');
var twilio = require('twilio');
var client = twilio(config.accountSid, config.authToken);

module.exports = function(app) {
  app.get('/call', function(req, res) {
    res.send('call');
  });

  app.post('/call', function(req, res) {
    console.log(req.body.phoneNumber);
    client.makeCall({
            to: req.body.phoneNumber,
            from: config.twilioNumber,
            url: process.env.URL + '/outbound'
        }, function(err) {
          console.log(err);
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
        // We could use twilio.TwimlResponse, but Jade works too - here's how
        // we would render a TwiML (XML) response using Jade
    console.log('twilio request: ' + req.body.CallSid);
    res.type('text/xml');
    res.render('outbound', {firstName: req.params.firstName, lastName: req.params.lastName, phoneNumber: req.params.phoneNumber});
  });
  app.post('/outbound/', function(req, res) {
        // We could use twilio.TwimlResponse, but Jade works too - here's how
        // we would render a TwiML (XML) response using Jade
    console.log('twilio request:' + req.body.CallSid);
    res.type('text/xml');
    res.render('outbound', {firstName: 'test', lastName: 'testing', phoneNumber: '5555555555'});
  });
};
