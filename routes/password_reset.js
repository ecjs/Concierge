'use strict';

var User = require('../models/user_model');
var sendgrid = require('sendgrid')(process.env.API_USER, process.env.API_KEY);

module.exports = function(app, jwtauth) {
  var generatePassword = function() {
    var length = 8;
    var charset = 'abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var retVal = '';
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };
  app.post('/passwordReset', function(req, res) {
    User.findOne({username: req.body.username}, function(err, user) {
      if (err) return res.status(500).send('there was an error' + err);
      user.password = generatePassword();
      user.save(function(err) {
        if (err) return res.status(500).send('there was an error' + err);
      });
      sendgrid.send({
        to:       user.username,
        from:     'chareesa@conciergeapp.co',
        subject:  'Password Reset for Concierge',
        text:     'Here is your new password for Concierge: ' + user.password
      }, function(err, json) {
        if (err) { return console.error(err); }
        res.send(json);
      });
    });
  });
};

//password generator found here: http://stackoverflow.com/questions/1497481/javascript-password-generator
