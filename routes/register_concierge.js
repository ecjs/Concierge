var express = require('express');
var router = express.Router();

module.exports = function(app) {
  app.get('/concierge', function(req, res) {
    res.send('concierge');
  });
  app.post('/concierge', function(req, res) {
    res.json(req.body);
  });
};
