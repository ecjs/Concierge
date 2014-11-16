var authController = require('../lib/auth');
var User = require('../models/user_model');
var jwt = require('jsonwebtoken');

module.exports = function(app, jwtauth) {
  app.post('/concierge', jwtauth, function(req, res) {
    req.user.concierge = true;
    User.findOneAndUpdate({'._id': req.user._id}, req.user, function(err, user) {
      if (err) return console.log('error updating user to concierge: ' + err);
      console.log('successfully updated user to concierge: ' + user);
    });
    res.send('successfully updated to concierge');
  });
  app.get('/concierge', function(req, res) {
    res.json(req.body);
  });
};
