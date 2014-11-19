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

User.collection.remove(function(err){
  if(err) throw(err);
});

  describe('time to make a change.', function(){
    var jwtToken;

    before(function (done) {
    chai.request(testUrl)
      .post('/users')
      .send({username:"joe10@example.com",password:"Foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
      .end(function (err, res) {
        jwtToken = res.body.jwt;
        done();
    });
  });

    it('should change a username', function(done){
      chai.request(testUrl)
        .put('/changeUsername')
        .set({jwt:jwtToken})
        .send({username:'joe10@example.com'})
        .end(function(err,res){
          expect(err).to.eql(null);
          expect(res.body).to.have.property('jwt');
          done();
        });
    });

    it('should change a phone number', function(done){
      chai.request(testUrl)
        .put('/changePhone')
        .set({jwt:jwtToken})
        .send({phone:'7736569341'})
        .end(function(err,res){
          expect(err).to.eql(null);
          expect(res.body).to.have.property('phone');
          done();
        });
    });

    it('should reset a password', function(done){
      chai.request(testUrl)
        .post('/passwordReset')
        .send({username:"joe10@example.com"})
        .end(function(err,res){
          expect(err).to.eql(null);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should change a password', function(done){
      chai.request(testUrl)
        .put('/changePassword')
        .set({jwt:jwtToken})
        .send({password:'Fooboo124'})
        .end(function(err,res){
          expect(err).to.eql(null);
          expect(res.body).to.have.property('jwt');
          done();
        });
    });
  });
