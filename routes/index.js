var express = require('express');
var router = express.Router();

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.send('index');
  });
};
