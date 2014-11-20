//concierge test
process.env.MONGO_URL = 'mongodb://localhost/users_test';
var chai = require('chai');
var chaihttp = require('chai-http');
var User = require('../models/user_model');
var moment = require('moment');
chai.use(chaihttp);

require('../server');

var expect = chai.expect;
var testUrl = 'http://localhost:3000';

User.collection.remove(function(err){
  if(err) throw(err);
});

describe('the concierge test', function(){
  var jwtToken;
  var jobdate = moment().utc().add(1, 'days').format();
  var id;

  //creates a user
  before(function (done) {
    chai.request(testUrl)
      .post('/users')
      .send({username:"joe20@example.com",password:"Foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
      .end(function (err, res) {
        jwtToken = res.body.jwt;
        done();
    });
  });

  //creates a job
  before(function(done){
    chai.request(testUrl)
      .post('/jobs')
      .set({jwt:jwtToken})
      .send(jobdate, true)
      .end(function(err, res){
        console.log(res.body);
        done();
      });
  });

  it('should create a concierge', function(done){
    chai.request('http://localhost:3000')
    .post('/concierge')
    .send({jwt:jwtToken})
    .end(function(err,res){
      expect(err).to.eql(null);
      expect(res.body.concierge).to.be.true;
      done();
    });
  });

  it('should notify a concierge is available', function(done){
    chai.request(testUrl)
      .post('/conciergeAvailable')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.eql(null);
        expect(res.body.conciergeAvailable).to.be.true;
        done();
      });
    });

  it('should notify a concierge is unavailable', function(done){
    chai.request(testUrl)
      .post('/conciergeUnavailable')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.eql(null);
        expect(res.body.conciergeAvailable).to.be.false;
        done();
      });
    });

  it('should get a concierge', function(done) {
    chai.request(testUrl)
      .get('/conciergeList')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.eql(null);
        expect(res.body).to.have.property('message');
        done();
      });
    });

  it('should get a list of concierge jobs', function(done){
    chai.request(testUrl)
      .get('/conciergeList')
      .set({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.eql(null);
        expect(res.body).to.have.property('message');
        done();
      });
    });

  it('should remove a user from the concierge list', function(done){
    chai.request(testUrl)
    .post('/conciergeToUser')
    .set({jwt:jwtToken})
    .end(function(err,res){
      expect(err).to.eql(null)
      expect(res.body.concierge).to.be.false;
      done();
    });
  });

});
