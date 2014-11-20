'use strict';

var mongoose = require('mongoose');
var QueueSchema = mongoose.Schema({
  jobDate: { type: String },
  parent: { type: String },
  parentName: {
    first: String,
    last: String
  },
  parentNumber: { type: String },
  optionsList: [],
  recurring: { type: Boolean },
  customMsg: { type: String },
  pickedConcierge: { type: String }
});

module.exports = mongoose.model('jobQueue', QueueSchema);
