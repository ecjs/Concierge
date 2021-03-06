//the call test
process.env.MONGO_URL = 'mongodb://localhost/users_test';
var chai = require('chai');
var chaihttp = require('chai-http');
var User = require('../models/user_model');
var Jobs = require('../models/jobs_model');
var Calls = require('../routes/call.js');
var moment = require('moment');
chai.use(chaihttp);

require('../server');
var jobsCheck = require('../lib/jobManager');

var expect = chai.expect;
var testUrl = 'http://localhost:3000';

User.collection.remove(function(err){
  if(err) throw(err);
});

  describe('testing to see if it makes calls', function(){
    var firstName;
    var lastName;
    var phoneNumber;

    var ConciergeJwtToken;
    var UserJwtToken;
    var jobdate = moment().utc().add(2, 'minutes').format();
    var id;

    //creates a user
    before(function (done) {
      chai.request(testUrl)
        .post('/users')
        .send({username:"joe20@example.com",password:"Foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
        .end(function (err, res) {
          UserJwtToken = res.body.jwt;
          console.log(UserJwtToken);
          done();
      });
    }); 

     //creates a job
    before(function(done){
      chai.request(testUrl)
        .post('/jobs')
        .set({jwt:UserJwtToken})
        .send({jobDate:jobdate,recurring:true})
        .end(function(err, res){
          console.log(res.body);
          done();
        });
      });

    //creates a concierge
    before(function(done){
      chai.request(testUrl)
      .post('/users')
      .send({username:"frank@example.com",password:"Foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
      .end(function(err,res){
        ConciergeJwtToken = res.body.jwt
        console.log(ConciergeJwtToken);
        done();
      });
    });

      it('should receive an outbound call with twilio from a live human', function(done){
        chai.request(testUrl)
        .post('/outbound/')
        .end(function(err,res){
          expect(err).to.eql(null);
          expect(res.status).to.eql(200);
          done();
        });
      });

      it('should receive an outbound call with twilio from a heartless machine.', function(done){
        chai.request(testUrl)
          .post()
      })

      jobsCheck.checkJobs();
  });
