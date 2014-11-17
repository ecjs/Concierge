process.env.MONGO_URL = 'mongodb://localhost/concierge_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('the concierge test', function(){
  var id;
  var jwtToken;

  before(function (done) {
    chai.request('https://quiet-dusk-4540.herokuapp.com')
    .post('/concierge')
    .send({email: 'test@example.com', password: 'foobar123'})
    .end(function (err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should create a concierge', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
    .post('/concierge')
    .send({'_id': req.user._id})
    .end(function(err,res){
      expect(err).to.be.eql(null);
      expect(res.body).to.have.property('_id');
      done();
    });
  });

  it('should confirm a concierge', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .post('/conciergeAvailable')
      .send({'_id': req.user._id})
      .end(function(err,res){
        expect(err).to.be.eql(null);
        expect(res.body).to.be.true;
        expect(res.body).to.have.property('_id');
        done();
      });
    });

  it('should get a concierge', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
      .post('/concierge')
      .auth() //should be some type of auth even though its not in the register_concierge get
      .end(function(err,res){
        expect(err).to.be.eql(null);
        expect(res.body).to.have.property('_id');
      });
    });

});
