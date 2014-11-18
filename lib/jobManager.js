'use strict';

var moment = require('moment');
var Jobs = require('../models/jobs_model');
var User = require('../models/user_model');
var JobsQueue = require('../models/jobQueue_model');
var config = require('../config');
var twilio = require('twilio');
var client = twilio(config.accountSid, config.authToken);

function addToQueue(job) {
  var jobDate = moment(job.jobDate).utc().format();
  var later = moment().add(1, 'days').utc().format();
  // if the job date is within the next 24 hrs, add to Queue
  if (moment(jobDate).isBefore(moment(later))) {
    //look for Concierge
    var newConcierge;
    User.findOneRandom({concierge: true}, {conciergeAvailable: true}, function(err, result) {
      if (err) return console.log('could not match with Concierge: ' + err);
      console.log('matched concierge with this user: ' + result);
      newConcierge = result;
      var newQueue = new JobsQueue({
        jobDate: job.jobDate,
        parent: job.parent,
        parentName: {
          first: job.parentName.first,
          last: job.parentName.last
        },
        parentNumber: job.parentNumber,
        optionsList: job.optionsList,
        recurring: job.recurring,
        pickedConcierge: newConcierge._id
      });
      newQueue.save(function(err, data) {
        if (err) return console.log('error saving job to Queue');
        console.log('newQueue job id: ' + data._id);
        console.log('saved job to queue');
        console.log('The concierge users id is: ' + newConcierge._id);
        User.findById(newConcierge._id, function(err, user) {
          if (err) return console.log('error finding concierge: ' + err);
          if (user === null) return console.log('user is null');
          user.conciergeJobs.push(data._id);
          user.save(function(err, res) {
            if (err) res.status(500).send(err);
            console.log('added Queued Job to Concierges Job array.');
          });
          // if recurring job, add 1 day to the jobs current date.
          if (job.recurring === true) {
            var newJobDate = moment(job.jobDate).add(1, 'days').utc().format();
            var tempJob = job;
            job.jobDate = newJobDate;
            job = job.toObject();
            delete job._id;
            Jobs.findOneAndUpdate({_id: tempJob._id}, job, function(err) {
              if (err) return console.log('error updating recurring job in db: ' + err);
              console.log('successfully updated job: ' + tempJob._id);
            });
          }
          // if not recurring, remove the job from the Jobs database.
          else {
            Jobs.remove({_id: job._id}, function(err) {
              if (err) return console.log('unable to remove job: ' + job._id);
            });
          }
        });
      });
    });
  }
}

function sendToTwilio(job) {
  var jobDate = moment(job.jobDate).utc().format();
  var later = moment().add(5, 'minutes').utc().format();
  // if the job date is within the next 5 minutes, send to Twilio
  if (moment(jobDate).isBefore(moment(later))) {
    User.findById(job.pickedConcierge, function(err, concierge) {
      if (err) return console.log('error finding picked concierge before call.');
      if (concierge === null) return console.log('concierge is null when finding before call.');
      client.makeCall({
              to: concierge.phone,
              from: config.twilioNumber,
              url: process.env.URL + '/outbound/' + job.parentName.first + '/' + job.parentName.last + '/' + job.parentNumber + '/'
          }, function(err) {
            console.log(err);
            if (err) {
              console.log('error making a call: ' + err);
            } else {
              console.log('call successfully made!');
            }
          });
    });

    JobsQueue.remove({_id: job._id}, function(err) {
      if (err) return console.log('unable to remove job from Queue: ' + job._id);
    });
  }
}

exports.checkJobs = function() {
  var jobStream = Jobs.find().stream();
  jobStream.on('data', function(job) {
    addToQueue(job);
    console.log(moment(job.jobDate).utc().format());
  });
};

exports.checkQueue = function() {
  var queueStream = JobsQueue.find().stream();
  queueStream.on('data', function(job) {
    sendToTwilio(job);
  });
};
