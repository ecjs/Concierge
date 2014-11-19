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
    chai.request('http://localhost:3000')
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
        .post('/changePhone')
        .set({jwt:jwtToken})
        .send('546bfed2bacbe63f2280c943')
        .end(function(err,res){
          expect(err).to.eql(null);
          expect(res.body).to.be.json;
          done();
        });
    });

    it('should change a password', function(done){
      chai.request(testUrl)
        .get('/changePassword')
        .set({jwt:jwtToken})
        .send({username:'joe10@example.com'})
        .end(function(err,res){
          expect(err).to.eql(null);
          expect(res.body).to.have.property('jwt');
          done();
        });
    });
  });


