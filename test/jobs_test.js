process.env.MONGO_URL = 'mongodb://concierge:foobar123@ds053190.mongolab.com:53190/concierge';
var chai = require('chai');
var chaihttp = require('chai-http');
var moment = require('moment');
chai.use(chaihttp);

var expect = chai.expect;

describe('the jobs test', function(){
  var id;
  var jwtToken;
  var date = moment().utc().add(1, 'days').format();

  before(function (done) {
    chai.request('https://quiet-dusk-4540.herokuapp.com')
    .post('/call')
    .send({email: 'test@example.com', password: 'foobar123'})
    .end(function (err, res) {
      console.log(err);
      jwtToken = res.body.jwt;
      done();
    });
  });

  before(function (done){
    chai.request('https://quiet-dusk-4540.herokuapp.com')
    .post('/jobs')
    .send({jobDate:date, parent: jwtToken, recurring:true, parentName:{first:'Joe',last:'Elsey'}, parentNumber:'8474775286'});
    .end(function (err,res){
      console.log(err);

      done();
    })
  })

  it('should make a call', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com/')
      .post('/outbound/:firstName/:lastName/:phoneNumber/')
      .send({'joe','elsey','8474775286' })
      .end(function(err, res){
        expect(err).to.be(null)
        expect(res.body).to.have.property('_id')
      });
  });

  it('should create a job', function(done){
    chai.request('https://quiet-dusk-4540.herokuapp.com/')
      .post('/jobs')
      .send({jobDate:'11/29/14', parent: jwtToken, recurring:true, parentName:{first:'Joe',last:'Elsey'}, parentNumber:'8474775286'}))
  })


});

