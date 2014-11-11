var express = require('express');
var router = express.Router();

module.exports = function(app) {
  app.get('/call', function(req, res) {
    res.send('call');
  });

  app.post('/call', function(req, res) {
    res.json(req.body);
  });
};
