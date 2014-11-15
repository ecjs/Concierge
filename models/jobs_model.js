var mongoose = require('mongoose');
var JobSchema = mongoose.Schema({
  jobDate: {
    type: String
  },
  parent: {
    type: String
  },
  parentName: {
    first: String,
    last: String
  },
  parentNumber: {
    type: String
  },
  optionsList: [],
  recurring: {
    type: Boolean
  }
});

module.exports = mongoose.model('Job', JobSchema);
