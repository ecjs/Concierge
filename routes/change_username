'use strict';

var User = require('../models/user_model');

module.exports = function(app, jwtauth) {
  app.put('/changeUsername', jwtauth, function(req, res) {
    User.findOne({username: req.user.username}, function(err, user) {
      if (err) return res.status(500).send('there was an error' + err);
      user.username = req.body.username;
      user.save(function(err) {
        if (err) return res.status(500).send('there was an error' + err);
      });
      res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
    });
  });
};
