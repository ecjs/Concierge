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
    Job.remove({_id: req.params.id}, function(err) {
      if (err) return res.status(500).send('there was an error deleting this job');
      res.json({msg: 'Job deleted successfully!'});
    });
    User.findOne({id_: req.user._id}, function(err, user) {
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
