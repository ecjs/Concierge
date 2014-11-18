process.env.MONGO_URL = 'mongodb://localhost/user_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('the user test', function(){
  var id;
  var jwtToken;

  before(function (done) {
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .post('/users')
      .send("joe1234","foobar123","8474775286",{"joe","elsey"})
      .end(function (err, res) {
        jwtToken = res.body.jwt;
        done();
    });
  });

  it('should create a user', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .post('/users')
      .send("joe7890","foobar123","8474775286",{"joe","elsey"}) //or confirmation code?
      .end(function(err, res){
        expect (err).to.be.eql(null);
        expect (res.body).to.have.property('jwt');
        done();
    });
  });

  it('should get a user', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .get('/users')
      .auth()   //jwt or confirmation code?
      .end(function(err,res){
        expect (err).to.be.eql(null);
        expect (res.body).to.be.eql('jwt');
        done();
      });
    });

  it('should confirm a user', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .post('/confirm')
      .auth() //confirmation code?
      .end(function(err,res){
        expect (err).to.be.eql(null);
        expect (res.body).to.have.property('_id');
        done();
      }); 
    });

  it('should get a confirmed user', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .get('/confirm')
      .auth()
      .end(function(err,res){
        expect (err).to.be.eql(null);
        expect (res.body).to.have.property('_id');
      })
  })

}); 
