var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
<<<<<<< HEAD
var User = require('../models/register_user');
=======
var User = require('../models/user');
>>>>>>> 1c4d4c3541578e03af7d3fb6b9f11513f77794e7

passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

<<<<<<< HEAD
exports.isAuthenticated = passport.authenticate('basic', { session : false });
=======
exports.isAuthenticated = passport.authenticate('basic', { session: false });
>>>>>>> 1c4d4c3541578e03af7d3fb6b9f11513f77794e7
