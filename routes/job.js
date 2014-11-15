var Job = require('../models/jobs_model');
var authController = require('../lib/auth');

module.exports = function(app, jwtauth) {
  app.post('/jobs', jwtauth, function(req, res) {
    today = new Date();
    var newJob = new Job({
      jobDate: req.body.jobDate,
      parent: req.body.parent,
      recurring: req.body.recurring,
      parentName: req.body.parentName,
      parentNumber: req.body.parentNumber
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
