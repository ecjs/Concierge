'use strict';

var Job = require('../models/jobs_model');
var User = require('../models/user_model');

module.exports = function(app, jwtauth) {
  app.post('/jobs', jwtauth, function(req, res) {
    console.log('the user for this job post is: ' + req.user);
    console.log('the users first name for this job post is: ' + req.user.name.first);
    var newJob = new Job({
      jobDate: req.body.jobDate,
      parent: req.user._id,
      recurring: req.body.recurring,
      parentName: {first: req.user.name.first, last: req.user.name.last},
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

};
