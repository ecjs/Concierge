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
  var later = moment().add(10, 'minutes').utc().format();
  var tooLate = moment().add(2, 'minutes').utc().format();
  // if the job date is within the next 24 hrs, add to Queue
  if (moment(jobDate).isBefore(moment(later))) {
    //look for Concierge
    var newConcierge;
    User.findOneRandom({conciergeAvailable: true}, function(err, result) {
      if (err) return console.log('could not match with Concierge: ' + err);
      if (result === null) {
        // if we cant match the user, then at 2 minutes prior to the alarm, initiate a call using robo voice.
        if (moment(jobDate).isBefore(moment(tooLate))) {
          client.makeCall({
            to: job.parentNumber,
            from: config.twilioNumber,
            statusCallback: process.env.URL + '/StatusCallBack/' + job.parentName.first + '/' + job.parentName.last + '/' + job.parentNumber,
            statusCallbackMethod: 'POST',
            ifMachine: 'Hangup',
            url: process.env.URL + '/outboundNoConcierge/' + job.parentName.first + '/' + job.parentName.last + '/'
          }, function(err) {
            console.log(err);
            if (err) {
              console.log('error making a call: ' + err);
            }
            else {
              console.log('ROBO call successfully made!');
            }
          });
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
            console.log('console log the dang user id: ' + job._parent);
            User.findById(job.parent, function(err, user) {
              if (user === null) console.log('user is NULL for removing job from user array.');
              console.log('console log the dang user:' + user);
              var index = user.jobs.indexOf(job._id);
              if (index > -1) user.jobs.splice(index, 1);
              user.save(function(err) {
                if (err) console.log('could not delete job from user array');
                console.log('job removed from user jobs array.');
              });
            });
          }
          // Jobs.remove({_id: job._id}, function(err) {
          //   if (err) return console.log('unable to remove job: ' + job._id);
          //   console.log('Robo call made, job removed :(');
          // });
        }
        return console.log('no available concierge users');
      }
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
        customMsg: job.customMsg,
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
            console.log('console log the dang user id: ' + job._parent);
            User.findById(job.parent, function(err, user) {
              if (user === null) console.log('user is NULL for removing job from user array.');
              console.log('console log the dang user:' + user);
              var index = user.jobs.indexOf(job._id);
              if (index > -1) user.jobs.splice(index, 1);
              user.save(function(err) {
                if (err) console.log('could not delete job from user array');
                console.log('job removed from user jobs array.');
              });
            });
          }
        });
      });
    });
  }
}

function sendToTwilio(job) {
  var jobDate = moment(job.jobDate).utc().format();
  var later = moment().add(3, 'minutes').utc().format();
  // if the job date is within the next 5 minutes, send to Twilio
  if (moment(jobDate).isBefore(moment(later))) {
    User.findById(job.pickedConcierge, function(err, concierge) {
      if (err) return console.log('error finding picked concierge before call.');
      if (concierge === null) return console.log('concierge is null when finding before call.');
      client.makeCall({
              to: concierge.phone,
              from: config.twilioNumber,
              statusCallback: process.env.URL + '/StatusCallBack/' + job.parentName.first + '/' + job.parentName.last + '/' + job.parentNumber,
              statusCallbackMethod: 'POST',
              ifMachine: 'Hangup',
              url: process.env.URL + '/outbound/' + job.parentName.first + '/' + job.parentName.last + '/' + job.parentNumber + '/'
          }, function(err) {
            console.log(err);
            if (err) {
              console.log('error making a call: ' + err);
            } else {
              console.log('call successfully made!');
            }
          });
      var index = concierge.conciergeJobs.indexOf(job._id);
      console.log('the index is!: ' + index);
      if (index > -1) concierge.conciergeJobs.splice(index, 1);
      console.log('spliced concierge jobs' + concierge.conciergeJobs);
      concierge.save(function(err) {
        if (err) console.log('error removing job from concierge jobs');
        console.log('successfully removed job from concierge jobs');
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
  });
};

exports.checkQueue = function() {
  var queueStream = JobsQueue.find().stream();
  queueStream.on('data', function(job) {
    sendToTwilio(job);
  });
};
