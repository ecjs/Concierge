'use strict';

var User = require('../models/user_model');

module.exports = function(app, jwtauth) {
  app.get('/userJobs/:id', jwtauth, function(req, res) {
    User.find({'_id': req.params.id}, function(err, user) {
      if (err) return res.json({msg: 'no jobs found'});
      res.json(req.user.jobs);
    });
  });

  // app.delete('/api/notes/:id', function(req, res) {
  //   Job.remove({'_id': req.params.id}, function(err) {
  //     if (err) return res.status(500).send('there was an error');
  //     res.json({msg: 'job deleted successfully!'});
  //   });
  // });
};
