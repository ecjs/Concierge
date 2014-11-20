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

describe('the jobs test', function(){
  var jwtToken;
  var jobdate = moment().utc().add(2, 'minutes').format();
  var id;

  before(function (done) {
    chai.request(testUrl)
    .post('/users')
    .send({username:"joe3@example.com",password:"Foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
    .end(function (err, res) {
      console.log(res.body);
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should create a job', function(done){
    chai.request(testUrl)
      .post('/jobs')
      .set({jwt:jwtToken})
      .send({jobDate:jobdate, recurring:true})
      .end(function(err, res){
        expect(err).to.eql(null);
        expect(res.body).to.have.property('parent');
        console.log(res.body);
        id = res.body._id;
        done();
      });
  });

  it('should get a job', function(done){
    chai.request(testUrl)
      .get('/jobs')
      .set({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.be.true;
        done();
      });
  });

  it('should delete a job', function(done){
    chai.request(testUrl)
      .delete('/userJobs/' + id)
      .set({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.eql(null)
        expect(res.body).to.have.property('msg');
        done();
      });
  });

  it('should find a concierge job', function(){
    chai.request(testUrl)
      .get('/conciergeJobs')
      .set({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.eql(null);
        expect(res.body).to.have.property('_id');
      });
  });

});
