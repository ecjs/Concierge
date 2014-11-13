<<<<<<< HEAD
'use strict';
var User = require('../models/user_model');
var authController = require('../lib/auth');
=======
var User = require('../models/user');
var authController = require('../controllers/auth');
>>>>>>> 1c4d4c3541578e03af7d3fb6b9f11513f77794e7

module.exports = function(app) {
  app.post('/users', function(req, res) {
    var user = new User({
      username: req.body.username,
      password: req.body.password
    });
<<<<<<< HEAD
    user.save(function(err, data) {
      if (err) return res.send(err);
      res.json({'jwt': user.generateToken(app.get('jwtSecret'))});
    });
  });
  app.get('/users', authController.isAuthenticated, function(req, res) {
    res.json({'jwt': req.user.generateToken(app.get('jwtSecret'))});
=======
    user.save(function(err) {
      if (err) res.send(err);

      res.json({message: 'New note user added!'});
    });
>>>>>>> 1c4d4c3541578e03af7d3fb6b9f11513f77794e7
  });
};
