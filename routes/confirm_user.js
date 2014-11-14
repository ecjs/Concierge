var User = require('../models/user_model');
var authController = require('../lib/auth');

module.exports = function(app, jwtauth) {
  app.post('/confirm', jwtauth, function(req, res) {
    var confirmation = req.confirmationCode;
    User.findOne({'_id': req.user._id, 'confirmationCode': confirmation}, function(err, user) {
      console.log(user);
      if (err) { return next(err); }
      user.save(function(err) {
    if (err) { return next(err); }
  });
});
  });
  app.get('/confirm', jwtauth, function(req, res) {
    newJob.find({}, function(err, data) {
      if (err) return res.status(500).send(err);
      res.json(data);
    });
  });
};
