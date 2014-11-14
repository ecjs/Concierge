var config = require('../config');
var twilio = require('twilio');
var client = twilio(config.accountSid, config.authToken);

module.exports = function(app) {
  app.get('/call', function(req, res) {
    res.send('call');
  });

  app.post('/call', function(req, res) {
    client.makeCall({
            to: req.body.phoneNumber,
            from: config.twilioNumber,
            url: process.env.URL + '/outbound'
        }, function(err, message) {
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

  app.post('/outbound', function(req, res) {
        // We could use twilio.TwimlResponse, but Jade works too - here's how
        // we would render a TwiML (XML) response using Jade
    res.type('text/xml');
    res.render('outbound');
  });
};
