process.env.MONGO_URL = 'mongodb://localhost/jobs_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('the jobs test', function(){
  var id;
  var jwtToken;

  before(function (done) {
    chai.request('')
    .post('/call')
    .send({email: 'test@example.com', password: 'foobar123'})
    .end(function (err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should make a call', function(done){
    chai.request('')
      .post('/outbound/:firstName/:lastName/:phoneNumber/')
      .send({'joe','elsey','8474775286' })
      .end(function(err, res){
        expect(err).to.be(null)
        expect(res.body).to.have.property('_id')
      })
  })


});

