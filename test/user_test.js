process.env.MONGO_URL = 'mongodb://concierge:foobar123@ds053190.mongolab.com:53190/concierge';
var chai = require('chai');
var chaihttp = require('chai-http');
var User = require('../models/user_model.js');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

User.collection.drop(function(err){
  if(err) throw(err);
});

describe('the user test', function(){
  var id;
  var jwtToken;
  

  before(function (done) {
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .post('/users')
      .send({username:"joe1234",password:"foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
      .end(function (err, res) {
        jwtToken = res.body.jwt;
        done();
    });
  });
   //var code = User.collection.find({confirmationCode:res.body.confirmationCode});

  it('should create a user', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .post('/users')
      .send({username:"joe1234",password:"foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}}) //or confirmation code?
      .end(function(err, res){
        expect (err).to.be.eql(null);
        expect (res.body).to.have.property('jwt');
        done();
    });
  });

  it('should get a user', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .get('/users')
      .auth("joe1234","foobar123")
      .end(function(err,res){
        expect (err).to.be.eql(null);
        expect (res.body).to.have.property('jwt');
        done();
      });
    });

  it('should confirm a user', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .post('/confirm')
      .set({jwt:jwtToken}) 
      .end(function(err,res){
        expect (err).to.be.eql(null);
        expect (res.body.confirmed).to.be.false;
        done();
      }); 
    });

  it('should get a confirmed user', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .post('/confirm')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect (err).to.be.eql(null);
        expect (res.body.confirmed).to.be.false;
      });
  });

}); 
