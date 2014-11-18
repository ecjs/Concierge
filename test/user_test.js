//user test

var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var testingUrl = 'https://salty-earth-1782.herokuapp.com';
var mongoose = require('mongoose');
var expect = chai.expect;
mongoose.connect(process.ENV.MONGO_URL);
mongoose.connection.collections['users'].drop( function(err) {
  console.log('user collection dropped');
});
mongoose.connection.collections['jobs'].drop( function(err) {
  console.log('jobs collection dropped');
});
mongoose.connection.collections['jobqueue'].drop( function(err) {
  console.log('jobqueue collection dropped');
});
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
