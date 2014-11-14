var moment = require('moment');

function addToQueue(date) {
  var jobDate = moment(date).utc().format();
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
