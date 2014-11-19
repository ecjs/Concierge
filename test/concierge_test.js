//concierge test

//process.env.MONGO_URL = 'mongodb://concierge:foobar123@ds053190.mongolab.com:53190/concierge';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

var expect = chai.expect;

describe('the concierge test', function(){
  var jwtToken;

  before(function (done) {
    chai.request('https://quiet-dusk-4540.herokuapp.com')
    .post('/users')
    .send({username:"fred1234",password:"foobar123",phone:"8474775286",name:{first:"joe",last:"elsey"}})
    .end(function (err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should create a concierge', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
    .post('/concierge')
    .send({jwt:jwtToken})
    .end(function(err,res){
      expect(err).to.be.eql(null);
      expect(res.body.concierge).to.be.true;
      done();
    });
  });

  it('should notify a concierge is available', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .post('/conciergeAvailable')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.be.eql(null);
        expect(res.body.conciergeAvailable).to.be.true;
        done();
      });
    });

  it('should notify a concierge is unavailable', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .post('/conciergeUnavailable')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.be.eql(null);
        expect(res.body.conciergeAvailable).to.be.false;
        done();
      });
    });

  it('should get a concierge', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .get('/concierge')
      .send({jwt:jwtToken})
      .end(function(err,res){
        expect(err).to.be.eql(null);
        expect(res.body).to.have.property('jwt');
        done();
      });
    });

});
