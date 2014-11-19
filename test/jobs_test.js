'use strict';

//jobs test
process.env.MONGO_URL = 'mongodb://localhost/users_test';
var chai = require('chai');
var chaihttp = require('chai-http');
var User = require('../models/user_model');
var moment = require('moment');
chai.use(chaihttp);

require('../server');

var expect = chai.expect;
var testUrl = 'http://localhost:3000';

User.collection.remove(function(err) {
  if (err) throw(err);
});

describe('the jobs test', function() {

  var jwtToken;
  var jobdate = moment().utc().add(1, 'days').format();

  before(function (done) {
    chai.request(testUrl)
    .post('/users')
    .send({username:'joe3@example.com', password:'Foobar123', phone:'8474775286', name:{first:'joe', last:'elsey'}})
    .end(function (err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

// job tests ===============================================
  it('should create a job', function(done) {
    chai.request(testUrl)
      .post('/jobs')
      .set({jwt:jwtToken})
      .send(jobdate, true)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('parent');
        done();
      });
  });

  it('should get a job', function(done) {
    chai.request(testUrl)
      .get('/jobs')
      .send({jwt:jwtToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.be.true;
        done();
      });
  });

});
