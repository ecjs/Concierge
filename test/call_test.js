'use strict';
//the call test
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

  describe('testing to see if it makes calls', function(){
    var firstName;
    var lastName;
    var phoneNumber;

    before(function (done) {
      chai.request(testUrl)
      .post('/users')
      .send({username:"joe20@example.com",password:"Foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
      .end(function (err, res) {
        jwtToken = res.body.jwt;
        console.log(res.body);
        done();
    });
  });

    it('should make an outbound call', function(done){
      chai.request(testUrl)
      .post('/outbound/joe/elsey/8474775286')
      .end(function(err,res){
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
    });

  });
