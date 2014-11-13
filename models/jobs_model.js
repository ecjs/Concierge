var mongoose = require('mongoose');
var JobSchema = mongoose.Schema({
  wakeUpTime: {
    type: String
  },
  parent: {
    type: String
  },
  options: [{ optionName: String }],
  zipcode: {
    type: String
  },
  recurring: {
    type: Boolean
  },
  jobDate: {
    type: Date
  }
});

module.exports = mongoose.model('Job', JobSchema);
