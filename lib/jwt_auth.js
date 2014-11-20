'use strict';

var User = require('../models/user_model');
var jwt = require('jsonwebtoken');

module.exports = function(secret) {
  return function(req, res, next) {
    var token = req.headers.jwt || req.body.jwt;

    var decrypted;
    jwt.verify(token, secret, function(err, decoded) {
      if (err) return res.status(403).send('access denied');
      decrypted = decoded;
      console.log(decrypted.issuer);
      User.findOne({_id: decrypted.issuer}, function(err, user) {
        if (err) return res.status(403).send('access denied');
        if (!user) return res.status(403).send('access denied');

        req.user = user;
        next();

      });
    });
  };
};
