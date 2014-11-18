//user test

var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;
describe('the user test', function(){
  var id;
  var jwtToken;


  before(function (done) {
    chai.request(testingUrl)
      .post('/users')
      .send({username:"joe1234",password:"foobar123",phone:"3607393580",name:{first:"joe",last:"elsey"}})
      .end(function (err, res) {
        jwtToken = res.body.jwt;
        done();
    });
  });

  it('should create a user', function(done){
    chai.request(testingUrl)
      .post('/users')
      .send({username:"joe1234",password:"foobar123",phone:"3607393580",name:{first:"joe",last:"elsey"}}) //or confirmation code?
      .end(function(err, res){
        expect (err).to.be.eql(null);
        expect (res.body).to.have.property('jwt');
        done();
    });
  });

  it('should get a user', function(done){
    chai.request(testingUrl)
      .get('/users')
      .auth("joe1234","foobar123")
      .end(function(err,res){
        expect (err).to.be.eql(null);
        expect (res.body).to.have.property('jwt');
        done();
      });
    });

  it('should confirm a user', function(done){
    chai.request(testingUrl)
      .post('/confirm')
      .set({jwt:jwtToken})
      .end(function(err,res){
        expect (err).to.be.eql(null);
        expect (res.body.confirmed).to.be.false;
        done();
      });
    });

  it('should get a confirmed user', function(done){
    chai.request(testingUrl)
      .post('/confirm')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect (err).to.be.eql(null);
        expect (res.body.confirmed).to.be.false;
        done();
      });
  });

});
