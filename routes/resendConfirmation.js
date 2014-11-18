'use strict';

var User = require('../models/user_model');

module.exports = function(app, jwtauth) {
  app.post('/resendConfirmation', jwtauth, function(req, res) {
    User.findOne({'_id': req.user._id}, function(err, user) {
      if (user === null) {
        return res.status(500).json({msg: 'no user found'});
      }
      if (err) { return (err); }
      var randomCode = Math.floor(100000 + Math.random() * 900000);
      user.confirmationCode = randomCode;
      user.save(function(err) {
        if (err) { return (err); }
        client.sendMessage({ to: user.phone, from: config.twilioNumber, body:'Here is your Concierge confirmation number: ' + user.confirmationCode }, function(err) {
          if (err) console.log('confirmation code could not be sent.');
        });
        return res.status(202).json(user);
      });
    });
  });
};
