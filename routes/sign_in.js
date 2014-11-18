'use strict';

module.exports = function(app, jwtauth) {
  app.get('/signIn', function(req, res) {
    res.send('Sign in here');
  });
};

  app.post()
