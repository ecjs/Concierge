'use strict';

var User = require('../models/user_model');

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
  app.get('/passwordReset', jwtauth, function(req, res) {
    User.findOne({username: req.user.username}, function(err, user) {
      if (err) return res.status(500).send('there was an error' + err);
      user.password = generatePassword();
      user.save(function(err) {
        if (err) return res.status(500).send('there was an error' + err);
      });
      res.json({tempPass: user.password, jwt: req.user.generateToken(app.get('jwtSecret'))});
    });
  });
};

//password generator found here: http://stackoverflow.com/questions/1497481/javascript-password-generator
