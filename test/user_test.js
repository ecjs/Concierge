//user test
process.env.MONGO_URL = 'mongodb://localhost/users_test';
var chai = require('chai');
var chaihttp = require('chai-http');
var User = require('../models/user_model');
var Jobs = require('../models/jobs_model');
chai.use(chaihttp);

require('../server');

var expect = chai.expect;
var testUrl = 'http://localhost:3000';

User.collection.remove(function(err){
  if(err) throw(err);
});

describe('the user test', function(){
  var jwtToken;
  var id;

  before(function (done) {
    chai.request(testUrl)
      .post('/users')
      .send({username:"joe1@example.com",password:"Foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
      .end(function (err, res) {
        jwtToken = res.body.jwt;
        done();
    });
  });

  it('should create a user', function(done){
    chai.request(testUrl)
      .post('/users')
      .send({username:"joe2@example.com",password:"Foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
      .end(function(err, res){
        expect (err).to.be.eql(null);
        expect (res.body).to.have.property('jwt');
        id = res.body._id;
        done();
    });
  });

  it('should get a user', function(done){
    chai.request(testUrl)
      .get('/users')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect (err).to.be.eql(null);
        expect (res.body).to.be.Object; //can't currently test the alert window.
        done();
    });
  });

  it('should confirm a user', function(done){
    chai.request(testUrl)
      .post('/confirm')
      .set({jwt:jwtToken})
      .end(function(err,res){
        expect (err).to.be.eql(null);
        expect (res.body.confirmed).to.be.false;
        done();
    });
  });

  it('should get a confirmed user', function(done){
    chai.request(testUrl)
      .post('/confirm')
      .set({jwt:jwtToken})
      .end(function(err,res){
        expect (err).to.be.eql(null);
        expect (res.body.confirmed).to.be.false;
        done();
    });
  });

});
