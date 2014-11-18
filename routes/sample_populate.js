'use strict';
var superagent = require('superagent');
var agent = superagent.agent();

module.exports = function(app, jwtauth) {
  app.get('/samplePopulate', jwtauth, function(req, res) {
    agent
    .post('/user')
    .send({username: 'test@example.com', password: 'foobar123', name: {first:'Mark', last: 'Harrell'}, phone: '5555555555'})
    .set('Content-Type', 'application/json')
    .end(function(err, res) {
      if (err) return res.status(500).json({msg: 'couldnt send user'});
      console.log('added user in populate' + res);
    });
  });
};
