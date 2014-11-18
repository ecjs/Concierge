
var chai = require('chai');
var chaihttp = require('chai-http');
var moment = require('moment');
chai.use(chaihttp);

var expect = chai.expect;
var testUrl = 'https://quiet-dusk-4540.herokuapp.com/';

describe('the jobs test', function(){
  
  var jwtToken;
  var date = moment().utc().add(1, 'days').format();

  before(function (done) {
    chai.request(testUrl)
    .post('/call')
    .send({username:"joe1234",password:"foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
    .end(function (err, res) {
      console.log(err);
      jwtToken = res.body.jwt;
      done();
    });
  });

  before(function (done){
    chai.request(testUrl)
    .post('/jobs')
    .send({jobDate:date, recurring:true});
    .end(function (err,res){
      console.log(err);
      done();
    });
  });

// call tests ==============================================
  it('should make a call', function(done){
    chai.request(testUrl)
      .post('/outbound/')
      .send({'Joe','Elsey','8474775286'})
      .end(function(err, res){
        expect(err).to.be(null)
        expect(res.body).to.have.property('_id')
      });
  });

  it('should make an outbound call', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com/')
      .post()
  })







// job tests ===============================================
  it('should create a job', function(done){
    chai.request(testUrl)
      .post('/jobs')
      .send({jwt:jwtToken})
      .end(function(err, res){
        expect(err).to.be(null)
        expect(res.body).to.have.property('parent');
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

