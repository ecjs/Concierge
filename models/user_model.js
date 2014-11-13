var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var UserSchema = mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  concierge: {
    type: Boolean
  },
  zipcode: {
    type: String
  },
  jobs: [{type: String}]
});

UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.methods.generateToken = function(secret) {
  var self = this;
  var token  = jwt.sign({
    issuer: self._id
  }, secret, {expiresInMinutes: 20160});
  return token;
};

UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
