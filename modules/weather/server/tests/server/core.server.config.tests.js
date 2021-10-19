'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  Weather = mongoose.model('Weather'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  weather;

/**
 * Weather routes tests
 */
describe('Weather CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  it('should be able to get weather of city provided city name', function (done) {
    agent.get('/api/weather?city=' + 'gadag')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('lat', 15.4167);
        console.log('here??');
        // Call the assertion callback
        done();
      });
  });


  afterEach(function (done) {
    Weather.remove().exec()
      .then(done())
      .catch(done);
  });
});
