'use strict';

// var config = require('../config');
// var twilio = require('twilio');
// var client = twilio(config.accountSid, config.authToken);

module.exports = function(app) {
  app.post('/StatusCallBack/:firstName/:lastName/:phoneNumber', function(req, res) {
    if (req.body.AnsweredBy === 'machine') {
      res.type('text/xml');
      res.render('outboundMachine', {firstName: req.params.firstName, lastName: req.params.lastName, phoneNumber: req.params.phoneNumber});
    }
  });
};
