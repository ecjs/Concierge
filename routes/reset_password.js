'use strict';
var config = require('../config');
var twilio = require('twilio');
var client = twilio(config.accountSid, config.authToken);
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');

var User = require('../models/user_model');

module.exports = function(app, jwtauth) {

  app.get('/forgot', function(req, res) {
    res.render('forgot', {
      user: req.user
    });
  });

  app.post('/forgot', function(req, res) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            return res.redirect('/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport('SMTP', {
          service: 'SendGrid',
          auth: {
            user: 'chareesa',
            pass: '!!! YOUR SENDGRID PASSWORD !!!'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });







  var generatePassword = function() {
    var length = 8;
    var charset = 'abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var retVal = '';
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };
  app.put('/passwordReset', jwtauth, function(req, res) {
    User.findOne({username: req.user.username}, function(err, user) {
      if (err) return res.status(500).send('there was an error' + err);
      user.password = generatePassword();
      user.save(function(err) {
        if (err) return res.status(500).send('there was an error' + err);
      });
      res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
      client.messages.create({
        body: user.password,
        to: user.username,
        from: config.twilioNumber,
        url: process.env.URL + '/outbound'
      }, function(err) {
        console.log(err);
        if (err) {
          res.status(500).send(err);
        } else {
          res.send({
            message: 'Thank you! We will be calling you shortly.'
          });
        }
      });
    });
  });
};

//password generator found here: http://stackoverflow.com/questions/1497481/javascript-password-generator
