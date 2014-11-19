'use strict';

var User = require('../models/user_model');

module.exports = function(app, jwtauth) {
  app.get('/conciergeJobs', jwtauth, function(req, res) {
    User.find({_id: req.params.id}, function(err) {
      if (err) return res.json({msg: 'no jobs found'});
      res.json(req.user.conciergeJobs);
    });
  });
};
