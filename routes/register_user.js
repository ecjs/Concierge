'use strict';

var User = require('../models/user_model');
var authController = require('../lib/auth');
var config = require('../config');
var twilio = require('twilio');
var client = twilio(config.accountSid, config.authToken);
var validator = require('validator');

module.exports = function(app) {

  app.post('/users', function(req, res) {
    //check if email has valid syntax
    if (!(validator.isEmail(req.body.username))) {
      return res.status(500).send('that is not a valid email');
    }

    //set and check password requirements
    var regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(req.body.password)) {
      return res.status(500).send('password needs one number, lowercase, and uppercase letter and must be at least six characters');
    }

    User.findOne({username: req.body.username}, function(dbError, dbUser) {
      if (dbError) return res.status(500).send('server error');
      //check if user already exists
      if (dbUser) return res.status(500).send('That email is already registered');

      var user = new User({
        username: req.body.username,
        password: req.body.password,
        phone: req.body.phone,
        name: req.body.name,
        confirmed: false
      });
      var randomCode = Math.floor(100000 + Math.random() * 900000);
      user.confirmationCode = randomCode;

      user.save(function(err) {
        if (err) return res.status(500).send(err);
        console.log('to:', user.phone, 'from:', config.twilioNumber, 'code:', user.confirmationCode);
        // Check if user.phone matches the correct pattern (valid phone, does not start with +)
        client.sendMessage({ to: user.phone, from: config.twilioNumber, body:'Here is your Concierge confirmation number: ' + user.confirmationCode }, function(err2) {
          if (err2) return console.log('confirmation code could not be sent.' + err2);
        });
      });
      res.json({jwt: user.generateToken(app.get('jwtSecret'))});
    });
  });
  app.get('/users', authController.isAuthenticated, function(req, res) {
    res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
  });
};

//regex source:
//http://www.the-art-of-web.com/javascript/validate-password/
