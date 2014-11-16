var authController = require('../lib/auth');
var User = require('../models/user_model');
var jwt = require('jsonwebtoken');

module.exports = function(app, jwtauth) {
  app.post('/concierge', jwtauth, function(req, res) {
    console.log(req.user);
    res.send(req.user);
    // User.findOneAndUpdate({username: req.username})
  });
  app.get('/concierge', function(req, res) {
    res.json(req.body);
  });
};
