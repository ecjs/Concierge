'use strict';

var User = require('../models/user_model');
var jobQueue = require('../models/jobQueue_model');

module.exports = function(app, jwtauth) {
  app.post('/concierge', jwtauth, function(req, res) {
    console.log('this should be the users id: ' + req.user._id);
    User.findOne({_id: req.user._id}, function(err, user) {
      if (err) {
        console.log('error finding user to add concierge: ' + err);
        return res.status(500).json({message: 'error finding user'});
      }
      if (user === null) {
        console.log('no user found matching that id');
        return res.status(500).json({message: 'no user found matching that id'});
      }
      user.concierge = true;
      user.conciergeAvailable = false;
      user.save(function(err) {
        if (err) return res.status(500).json({message: 'no user found matching that id'});
        console.log('successfully updated user to concierge: ' + user);
        res.status(202).json({concierge: true});
      });
    });
  });
  app.post('/conciergeAvailable', jwtauth, function(req, res) {
    User.findOne({_id: req.user._id}, function(err, user) {
      if (err) {
        console.log('error finding Concierge to make available: ' + err);
        return res.status(500).json({message: 'error finding concierge'});
      }
      if (user === null) {
        console.log('no user found matching that id');
        return res.status(500).json({message: 'no user found matching that id'});
      }
      user.conciergeAvailable = true;
      user.conciergeJobs = [];
      user.save(function(err) {
        if (err) return res.status(500).json({message: 'no user found matching that id'});
        console.log('successfully updated concierge to available: ' + user._id);
        res.status(202).json({conciergeAvailable: true});
      });
    });
  });
  app.post('/conciergeUnavailable', jwtauth, function(req, res) {
    User.findOne({_id: req.user._id}, function(err, user) {
      if (err) {
        console.log('error finding Concierge to make unavailable: ' + err);
        return res.status(500).json({message: 'error finding concierge'});
      }
      if (user === null) {
        console.log('no user found matching that id');
        return res.status(500).json({message: 'no user found matching that id'});
      }
      user.conciergeAvailable = false;
      user.save(function(err) {
        if (err) return res.status(500).json({message: 'no user found matching that id'});
        console.log('successfully updated concierge to unavailable: ' + user._id);
        res.status(202).json({conciergeAvailable: false});
      });
    });
  });
  app.get('/concierge', jwtauth, function(req, res) {
    User.find({_id: req.user._id}, function(err, jobs) {
      if (err) {
        console.log('error finding concierge: ' + err);
        return res.status(500).json({message: 'error finding concierge'});
      }
      if (jobs === null) {
        console.log('no concierge found matching that id');
        return res.status(500).json({message: 'no concierge found matching that id'});
      }
      var jobsObject = JSON.parse(JSON.stringify(jobs));
      res.send(jobsObject.conciergeJobs);
      // jobQueue.findById({'id_': { $in: ['546c2d6c3fa04e02000f3ca5', '546c2d6c3fa04e02000f3ca6']}}, function(err, docs) {
      //   if (err) return res.status(500).json({message: 'error finding concierge jobs'});
      //   if (jobs === null) return res.status(500).json({message: 'no jobs found for concierge'});
      //   res.status(200).send(docs);
      // });
    });
  });
};
