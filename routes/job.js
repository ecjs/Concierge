'use strict';

var Job = require('../models/jobs_model');
var User = require('../models/user_model');

module.exports = function(app, jwtauth) {
  app.post('/jobs', jwtauth, function(req, res) {
    var newJob = new Job({
      jobDate: req.body.jobDate,
      parent: req.user._id,
      recurring: req.body.recurring,
      parentName: req.user.name,
      parentNumber: req.user.phone
    });

    newJob.save(function(err, job) {
      if (err) return res.send(err);
      User.findById(req.user._id, function(err, user) {
        if (err) return console.log('error finding user by ID for New Job Save: ' + err);
        if (user === null) return console.log('user is null during New Job save.');
        user.jobs.push(job._id);
        user.save(function(err) {
          if (err) return console.log('error saving job to user array');
          console.log('successfully saved job to user array.');
        });
      });
      res.json(job);
    });
  });

  app.get('/jobs', jwtauth, function(req, res) {
    Job.find({parent:req.user._id}, function(err, jobs) {
      if (err) return res.json({msg: 'no jobs found'});
      res.json(jobs);
    });
  });

  app.delete('/userJobs/:id', jwtauth, function(req, res) {
    console.log(req.user._id);
    Job.remove({_id: req.params.id}, function(err) {
      if (err) return res.status(500).send('there was an error deleting this job');
    });
    User.findOne({_id: req.user._id}, function(err, user) {
      if (user === null) console.log('not finding user');
      var index = user.jobs.indexOf(req.params.id);
      if (index > -1) user.jobs.splice(index, 1);
      user.save(function(err, user) {
        if (err) console.log('could not delete job from user array');
        console.log(user);
        res.json({msg: 'Job deleted successfully!'});
      });
    });
  });
};
