var Job = require('../models/jobs_model');
var User = require('../models/user_model');
var authController = require('../lib/auth');

module.exports = function(app, jwtauth) {
  app.post('/jobs', jwtauth, function(req, res) {
    today = new Date();
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
        user.save(function(err, job) {
          if (err) return console.log('error saving job to user array');
          console.log('successfully saved job to user array.');
        });
      });
      res.json(job);
    });
  });
  app.get('/jobs', jwtauth, function(req, res) {
    newJob.find({}, function(err, data) {
      if (err) return res.status(500).send(err);
      res.json(data);
    });
  });
};
