'use strict';

var User = require('../models/user_model');

module.exports = function(app, jwtauth) {
  app.get('/userInfo', jwtauth, function(req, res) {
    User.findOne({_id: req.user._id}, function(err, user) {
      if (user === null) {
        return res.status(500).json({message: 'no user'});
      }
      if (err) { return (err); }
      res.status(200).json(req.user);
    });
  });
};
