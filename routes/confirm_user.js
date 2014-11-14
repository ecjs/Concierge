var User = require('../models/user_model');
var authController = require('../lib/auth');

module.exports = function(app, jwtauth) {
  app.post('/confirm', jwtauth, function(req, res) {
    var confirmation = {confirmationCode: req.confirmationCode};
    User.findOne({'_id': jwtauth.decrypted.issuer}, function(err, data) {
      if (err) return res.status(500).send(err);
      console.log(confirmation);
      res.json(data);
    });
  });
  app.get('/confirm', jwtauth, function(req, res) {
    newJob.find({}, function(err, data) {
      if (err) return res.status(500).send(err);
      res.json(data);
    });
  });
};
