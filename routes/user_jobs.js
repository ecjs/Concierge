'use strict';

var Job = require('../models/jobs_model');
var User = require('../models/user_model');

module.exports = function(app, jwtauth) {
  app.get('/userJobs/:id', jwtauth, function(req, res) {
    User.find({_id: req.params.id}, function(err) {
      if (err) return res.json({msg: 'no jobs found'});
      res.json(req.user.jobs);
    });
  });

  app.delete('/userJobs/:id', jwtauth, function(req, res) {
    console.log(req.user._id);
    Job.remove({_id: req.params.id}, function(err) {
      if (err) return res.status(500).send('there was an error deleting this job');
      res.json({msg: 'Job deleted successfully!'});
    });
    User.findOne({_id: req.user._id}, function(err, user) {
      if (user === null) console.log('not finding user');
      console.log(user);
      var index = user.jobs.indexOf(req.params.id);
      console.log(index);
      if (index > -1) user.jobs.splice(index, 1);
      console.log(user.jobs);
      user.save(function(err, user) {
        if (err) console.log('could not delete job from user array');
        console.log(user);
      });
    });
  });
};
