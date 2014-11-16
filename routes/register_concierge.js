var authController = require('../lib/auth');
var User = require('../models/user_model');
var jwt = require('jsonwebtoken');

module.exports = function(app, jwtauth) {
  app.post('/concierge', jwtauth, function(req, res) {
    User.findOne({'._id': req.user._id}, function(err, user) {
      if (err) {
        console.log('error finding user to add concierge: ' + err);
        return res.status(500).json({message: 'error finding user'});
      }
      if (user === null) {
        console.log('no user found matching that id');
        return res.status(500).json({message: 'no user found matching that id'});
      }
      user.concierge = true;
      user.save(function(err) {
        if (err) return res.status(500).json({message: 'no user found matching that id'});
        console.log('successfully updated user to concierge: ' + user);
        res.status(202).json({concierge: true});
      });
    });
  });
  app.get('/concierge', function(req, res) {
    res.json(req.body);
  });
};
