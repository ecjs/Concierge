'use strict';

var User = require('../models/user_model');
var jobQueue = require('../models/jobQueue_model');

module.exports = function(app, jwtauth) {
  app.post('/concierge', jwtauth, function(req, res) {
    User.findOne({_id: req.user._id}, function(err, user) {
      if (err) {
        return res.status(500).json({message: 'error finding user to add concierge'});
      }
      if (user === null) {
        return res.status(500).json({message: 'no user found matching that id'});
      }
      user.concierge = true;
      user.conciergeAvailable = false;
      user.save(function(err) {
        if (err) return res.status(500).json({message: 'no user found matching that id'});
        res.status(202).json({concierge: true});
      });
    });
  });
  app.post('/conciergeAvailable', jwtauth, function(req, res) {
    User.findOne({_id: req.user._id}, function(err, user) {
      if (err) {
        return res.status(500).json({message: 'error finding concierge to make available'});
      }
      if (user === null) {
        return res.status(500).json({message: 'no user found matching that id'});
      }
      user.conciergeAvailable = true;
      user.conciergeJobs = [];
      user.save(function(err, doc) {
        if (err) return res.status(500).json({message: 'no user found matching that id'});
        res.status(202).json({conciergeAvailable: doc.conciergeAvailable});
      });
    });
  });
  app.post('/conciergeUnavailable', jwtauth, function(req, res) {
    User.findOne({_id: req.user._id}, function(err, user) {
      if (err) {
        return res.status(500).json({message: 'error finding concierge to make unavailable'});
      }
      if (user === null) {
        return res.status(500).json({message: 'no user found matching that id'});
      }
      user.conciergeAvailable = false;
      user.save(function(err, doc) {
        if (err) return res.status(500).json({message: 'no user found matching that id'});
        res.status(202).json({conciergeAvailable: doc.conciergeAvailable});
      });
    });
  });
  app.get('/conciergeList', jwtauth, function(req, res) {
    User.findOne({_id: req.user._id}).lean().exec(function(err, user) {
      if (err) {
        return res.status(500).json({message: 'error finding concierge'});
      }
      if (user === null) {
        return res.status(500).json({message: 'no concierge found matching that id'});
      }
      jobQueue.find({_id: { $in: user.conciergeJobs}}, function(err, docs) {
        if (err) return res.status(500).json({message: 'error finding concierge jobs'});
        if (docs.length === 0) return res.status(500).json({message: 'no jobs found for concierge'});
        res.status(200).send(docs);
      });
    });
  });
  app.post('/conciergeToUser', jwtauth, function(req, res) {
    User.findOne({_id: req.user._id}, function(err, user) {
      if (err) {
        return res.status(500).json({message: 'error finding user'});
      }
      if (user === null) {
        return res.status(500).json({message: 'no user found matching that id'});
      }
      user.concierge = false;
      user.conciergeAvailable = false;
      user.save(function(err) {
        if (err) return res.status(500).json({message: 'no user found matching that id'});
        res.status(202).json({concierge: false});
      });
    });
  });
  app.get('/concierge', jwtauth, function(req, res) {
    User.findOne({_id: req.user._id}, function(err, user) {
      res.status(200).json({concierge: user.concierge});
    });
  });
  app.get('/conciergeAvailable', jwtauth, function(req, res) {
    User.findOne({_id: req.user._id}, function(err, user) {
      res.status(200).json({conciergeAvailable: user.conciergeAvailable});
    });
  });
};
