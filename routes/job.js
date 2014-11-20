'use strict';

var Job = require('../models/jobs_model');
var User = require('../models/user_model');

module.exports = function(app, jwtauth) {
  app.post('/jobs', jwtauth, function(req, res) {
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
        if (err) return res.status(404).send('error finding user by ID for New Job Save: ' + err);
        if (user === null) return res.status(404).send('Unable to find use with id ' + req.user._id);
        user.jobs.push(job._id);
        user.save(function(err) {
          if (err) return res.status(500).send('error saving job to user array');
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

  app.put('/userJobs/:id', jwtauth, function(req, res) {
    Job.findOne({_id: req.params.id}, function(err, job) {
      if (err) return res.status(500).send('there was an error editing this job');
      if (job === null) return res.status(404).send('not finding JOB');
      job.jobDate = req.body.jobDate;
      job.recurring = req.body.recurring;
      job.save(function(err, job) {
        if (err) return 'could not edit job with id ' + req.params.id;
        res.json(job);
      });
    });
  });

  app.delete('/userJobs/:id', jwtauth, function(req, res) {
    Job.remove({_id: req.params.id}, function(err) {
      if (err) return res.status(500).send('there was an error deleting this job');
    });
    User.findOne({_id: req.user._id}, function(err, user) {
      if (user === null) res.status(404).send('not finding user');
      var index = user.jobs.indexOf(req.params.id);
      if (index > -1) user.jobs.splice(index, 1);
      user.save(function(err) {
        if (err) res.status(500).send('unable to delete user job with id ' + req.params.id);
        res.json({msg: 'Job deleted successfully!'});
      });
    });
  });
};
