var Job = require('../models/jobs_model');
var authController = require('../lib/auth');

module.exports = function(app, jwtauth) {
  app.post('/jobs', jwtauth, function(req, res) {
    today = new Date();
    var newJob = new Job({
      wakeUpTime: req.body.wakeUpTime,
      parent: req.body.parent,
      options: req.body.options,
      zipcode: req.body.zipcode,
      recurring: req.body.recurring,
      jobDate: req.body.jobDate
    });

    newJob.save(function(err, data) {
      if (err) return res.send(err);
      res.json(data);
    });
  });
  app.get('/jobs', jwtauth, function(req, res) {
    newJob.find({}, function(err, data) {
      if (err) return res.status(500).send(err);
      res.json(data);
    });
  });
};
