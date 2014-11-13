var authController = require('../lib/auth');
var jwt = require('jsonwebtoken');

module.exports = function(app) {
  app.get('/concierge', jwtauth, function(req, res) {
    res.send('concierge');
  });
  app.post('/concierge', function(req, res) {
    res.json(req.body);
  });
};
