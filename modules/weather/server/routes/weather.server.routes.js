'use strict';

var path = require('path'),
weather = require('../controllers/weather.server.controller');

module.exports = function (app) {
  // Root routing
  // retieve weather based on city, id, lat and long.
  app.route('/api/weather').get(weather.getWeather);

  app.route('/api/weather/forecast').get(weather.getWeatherForecast);

};
