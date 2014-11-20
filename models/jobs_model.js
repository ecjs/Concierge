'use strict';

var mongoose = require('mongoose');
var JobSchema = mongoose.Schema({
  jobDate: { type: String, required: true },
  parent: { type: String, required: true },
  parentName: {
    first: String,
    last: String
  },
  parentNumber: { type: String},
  optionsList: [],
  recurring: { type: Boolean },
  customMsg: { type: String }
});

module.exports = mongoose.model('Job', JobSchema);
