//concierge test

process.env.MONGO_URL = 'mongodb://localhost/users_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

var expect = chai.expect;
var testUrl = 'http://localhost:3000';

describe('the concierge test', function(){
  var jwtToken;

  before(function (done) {
    chai.request(testUrl)
    .post('/users')
    .send({username:"joe5@example.com",password:"Foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
    .end(function (err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should create a concierge', function(done){
    chai.request(testUrl)
    .post('/concierge')
    .send({jwt:jwtToken})
    .end(function(err,res){
      expect(err).to.be.eql(null);
      expect(res.body.concierge).to.be.true;
      done();
    });
  });

  it('should notify a concierge is available', function(done){
    chai.request(testUrl)
      .post('/conciergeAvailable')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.be.eql(null);
        expect(res.body.conciergeAvailable).to.be.true;
        done();
      });
    });

  it('should notify a concierge is unavailable', function(done){
    chai.request(testUrl)
      .post('/conciergeUnavailable')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.be.eql(null);
        expect(res.body.conciergeAvailable).to.be.false;
        done();
      });
    });

  it('should get a concierge', function(done){
    chai.request(testUrl)
      .get('/concierge')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.be.eql(null);
        expect(res.body).to.be.Object;
        done();
      });
    });

});
