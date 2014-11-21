'use strict';
//concierge test
process.env.MONGO_URL = 'mongodb://localhost/users_test';
var chai = require('chai');
var chaihttp = require('chai-http');
var User = require('../models/user_model');
var Jobs = require('../models/jobs_model');
var moment = require('moment');
chai.use(chaihttp);

require('../server');
var jobsCheck = require('../lib/jobManager');

var expect = chai.expect;
var testUrl = 'http://localhost:3000';

User.collection.remove(function(err) {
  if (err) throw(err);
});

describe('the concierge test', function() {
  var ConciergeJwtToken;
  var UserJwtToken;
  var jobdate = moment().utc().add(2, 'minutes').format();

  //creates a user
  before(function(done) {
    chai.request(testUrl)
      .post('/users')
      .send({username:'joe20@example.com', password:'Foobar123', phone:'8474775286', name:{first:'joe', last:'elsey'}})
      .end(function(err, res) {
        UserJwtToken = res.body.jwt;
        done();
      });
  });

  //creates a concierge
  before(function(done) {
    chai.request(testUrl)
    .post('/users')
    .send({username:'frank@example.com', password:'Foobar123', phone:'8474775286', name:{first:'joe', last:'elsey'}})
    .end(function(err, res) {
      ConciergeJwtToken = res.body.jwt;
      done();
    });
  });

  //creates a job
  before(function(done) {
    chai.request(testUrl)
      .post('/jobs')
      .set({jwt:UserJwtToken})
      .send({jobDate:jobdate, recurring:true})
      .end(function() {
        done();
      });
  });

  it('should create a concierge', function(done) {
    chai.request('http://localhost:3000')
    .post('/concierge')
    .set({jwt:ConciergeJwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.concierge).to.be.true;
      done();
    });
  });

  it('should notify a concierge is unavailable', function(done) {
    chai.request(testUrl)
      .post('/conciergeUnavailable')
      .set({jwt:ConciergeJwtToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(202);
        done();
      });
  });

  it('should notify a concierge is available', function(done) {
    chai.request(testUrl)
      .post('/conciergeAvailable')
      .set({jwt:ConciergeJwtToken})
      .end(function(err, res) {
        jobsCheck.checkJobs();
        expect(err).to.eql(null);
        expect(res.status).to.eql(202);
        done();
      });
  });

  it('should get a concierge', function(done) {
    chai.request(testUrl)
      .get('/conciergeList')
      .set({jwt:ConciergeJwtToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should get a list of concierge jobs', function(done) {
    chai.request(testUrl)
      .get('/conciergeList')
      .set({jwt:ConciergeJwtToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
  });

  it('should remove a user from the concierge list', function(done) {
    chai.request(testUrl)
    .post('/conciergeToUser')
    .set({jwt:ConciergeJwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.concierge).to.be.false;
      done();
    });
  });

});
