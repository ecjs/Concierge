var User = require('../models/user_model');
var authController = require('../lib/auth');
var config = require('../config');
var twilio = require('twilio');
var client = twilio(config.accountSid, config.authToken);

module.exports = function(app) {
  app.post('/users', function(req, res) {
    var user = new User({
      username: req.body.username,
      password: req.body.password,
      phone: req.body.phone
    });
    randomCode = Math.floor(100000 + Math.random() * 900000);
    user.confirmationCode = randomCode;

    user.save(function(err, data) {
      if (err) return res.send(err);
      client.sendMessage({ to: user.phone, from: config.twilioNumber, body:'Here is your Concierge confirmation number: ' + user.confirmationCode }, function(err, data) {
        if (err) return res.send('Could not send confirmation code');
      });
      res.json({'jwt': user.generateToken(app.get('jwtSecret'))});
    });
  });
  app.get('/users', authController.isAuthenticated, function(req, res) {
    res.json({'jwt': req.user.generateToken(app.get('jwtSecret'))});

  });
};
