'use strict';
//user test
process.env.MONGO_URL = 'mongodb://localhost/users_test';
var chai = require('chai');
var chaihttp = require('chai-http');
var User = require('../models/user_model');
var Jobs = require('../models/jobs_model');
chai.use(chaihttp);

require('../server');
require('../routes/register_user');

var expect = chai.expect;
var testUrl = 'http://localhost:3000';

User.collection.remove(function(err) {
  if (err) throw(err);
});

describe('the user test', function() {
  var jwtToken;
  var code;

  it('should create a user', function(done) {
    chai.request(testUrl)
      .post('/users')
      .send({username:'joe2@example.com', password:'Foobar123', phone:'8474775286', name:{first:'joe', last:'elsey'}})
      .end(function(err, res) {
        User.find({username:'joe2@example.com'}, function(err, data) {
          if (err) throw(err);
          for (var i = 0;i < data.length;i++) {
            code = data[i].confirmationCode;
          }
        });
        expect (err).to.eql(null);
        expect (res.body).to.have.property('jwt');
        jwtToken = res.body.jwt;
        done();
      });
  });

  it('should get a user', function(done) {
    chai.request(testUrl)
      .get('/users')
      .set({jwt:jwtToken})
      .auth('joe2@example.com', 'Foobar123')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('jwt');
        done();
      });
  });

  it('should confirm a user', function(done) {
    chai.request(testUrl)
      .post('/confirm')
      .set({jwt:jwtToken})
      .send({confirmationCode: code})
      .end(function(err, res) {
        expect (err).to.eql(null);
        expect (res.body.confirmed).to.be.true;
        expect (res.status).to.eql(202);
        done();
      });
  });

  it('should get a confirmed user', function(done) {
    chai.request(testUrl)
      .get('/confirmed')
      .set({jwt:jwtToken})
      .end(function(err, res) {
        expect (err).to.eql(null);
        expect (res.status).to.eql(200);
        done();
      });
  });

  it('should resend the confirmation code', function(done) {
    chai.request(testUrl)
      .post('/resendConfirmation')
      .set({jwt:jwtToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('_id');
        done();
      });
  });

});
