var moment = require('moment');
var Jobs = require('../models/jobs_model');

exports.checkJobs = function() {
  var jobStream = Jobs.find().stream();
  jobStream.on('data', function(job) {
    addToQueue(job);
    console.log(moment(job.jobDate).utc().format());
  });
};
function addToQueue(job) {
  var jobDate = moment(job.jobDate).utc().format();
  var later = moment().add(1, 'days').utc().format();
  // if the job date is within the next 24 hrs, add to Queue
  if (moment(jobDate).isBefore(moment(later))) {
    console.log('Sending to Queue: ' + jobDate);
  }
}

function sendToTwilio(date) {
  var jobDate = moment(date).utc().format();
  var later = moment().add(5, 'minutes'.utc().format());
  // if the job date is within the next 5 minutes, send to Twilio
  if (moment(jobDate).isBefore(moment(later))) {
    console.log('Sending to Twilio: ' + jobDate);
  }
}
