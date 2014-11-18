'use strict';
var superagent = require('superagent');
var agent = superagent.agent();

module.exports = function(app) {
  app.get('/samplePopulate', function(req, res) {
    agent
    .post('/users')
    .send({username: 'test@example.com', password: 'foobar123', name: {first:'Mark', last: 'Harrell'}, phone: '5555555555'})
    .set('Content-Type', 'application/json')
    .end(function(err, superRes) {
      if (err) return console.log('did not populate' + err + " " + superRes);
      console.log('added user in populate' + res);
    });
  });
};
