var User = require('../models/user_model');
var authController = require('../lib/auth');

module.exports = function(app, jwtauth) {
  app.post('/confirm', jwtauth, function(req, res) {
    var confirmation = {confirmationCode: req.confirmationCode};
    Note.findOneAndUpdate({'_id': req.user._id, 'confirmationCode': confirmation}, note, function(err, resNote) {
      if (err) return res.status(500).json(err);
      return res.status(202).json(resNote);
    });
  });
  app.get('/confirm', jwtauth, function(req, res) {
    newJob.find({}, function(err, data) {
      if (err) return res.status(500).send(err);
      res.json(data);
    });
  });
};
