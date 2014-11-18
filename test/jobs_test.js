//jobs test

process.env.MONGO_URL = 'mongodb://localhost/jobs_test';
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

describe('the jobs test', function(){
  
  var jwtToken;
  var jobdate = moment().utc().add(1, 'days').format();

  before(function (done) {
    chai.request(testUrl)
    .post('/users')
    .send({username:"joe14@example.com",password:"foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
    .end(function (err, res) {
      console.log(err);
      jwtToken = res.body.jwt;
      console.log(res.body);
      done();
    });
  });

// job tests ===============================================
  it('should create a job', function(done){
    chai.request(testUrl)
      .post('/jobs')
      .send({jwt:jwtToken})
      //.send({jobDate:jobdate, recurring:true})
      .end(function(err, res){
        expect(err).to.eql(null)
        expect(res.body).to.have.property('_id');
      });
  });

  it('should get a job', function(done){
    chai.request(testUrl)
      .get('/jobs')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.be(null);
        expect(res.body).to.have.property('parent');
      });
  });

});

