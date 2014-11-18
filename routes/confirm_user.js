'use strict';

var User = require('../models/user_model');

module.exports = function(app, jwtauth) {
  app.post('/confirm', jwtauth, function(req, res) {
    var confirmation = req.body.confirmationCode;
    console.log(confirmation);
    User.findOne({_id: req.user._id, confirmationCode: confirmation}, function(err, user) {
      console.log(confirmation);
      if (user === null) {
        console.log(confirmation);
        return res.status(500).json({confirmed: false});
      }
      if (err) { return (err); }
      user.confirmed = true;
      user.save(function(err) {
        if (err) { return (err); }
        return res.status(202).json(user);
      });
    });
  });
  app.get('/confirmed', jwtauth, function(req, res) {
    res.status(200).json({confirmed: req.user.confirmed});
  });
};
