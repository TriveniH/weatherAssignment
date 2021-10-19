'use strict';

var validator = require('validator'),
path = require('path'),
mongoose = require('mongoose'),
config = require(path.resolve('./config/config')),
request = require('request');

exports.getWeather = async function (req, res) {
  // console.log('req::'+ JSON.stringify(req));
  let city = req.query.city;
  let days = req.query.days;
  let cityId = req.query.id;
  let lat = req.query.lat;
  let lon = req.query.lon;

  let url = config.weather.openWeatherUri + '?';
  if (city) {
    url = url + 'q=' + city;
  } else if (cityId) {
    url = url + 'id=' + cityId
  } else if (lat && lon) {
    url = url + 'lat='+ lat + '&lon=' + lon;
  }
  url = url + '&units=imperial&appid=' + config.weather.apiKey;
  if (days > 0) {
    url = url + '&cnt=' + days;
  }
  console.log('url::'+ url);
  request(url, async function (err, response, body) {
    if (err) {
      console.log('error:', err);
    } else {
      console.log('weather api response body:', body);
      let weather = JSON.parse(body)
      weather = await createWeather(weather);
      return res.json(weather);
    }
  });
};

function weatherFormatting(weatherUnIn) {
  let weatherUnInshort = {
    temp: weatherUnIn.main.temp,
    feels_like: weatherUnIn.main.feels_like,
    temp_min: weatherUnIn.main.temp_min,
    temp_max: weatherUnIn.main.temp_max,
    lat: weatherUnIn.coord.lat,
    lon: weatherUnIn.coord.lon,
    pressure: weatherUnIn.main.pressure,
    humidity: weatherUnIn.main.humidity,
    dt: weatherUnIn.dt,
    sunrise: weatherUnIn.sys.sunrise,
    sunset: weatherUnIn.sys.sunset,
    visibility: weatherUnIn.visibility,
    windSpeed: weatherUnIn.wind.speed,
    windDeg: weatherUnIn.wind.deg,
    windGust: weatherUnIn.wind.gust
  }

  return weatherUnInshort;
}

async function createWeather(weatherUnIn) {
  console.log('weatherUnIn::' + JSON.stringify(weatherUnIn));
  const Weather = mongoose.model('Weather');
  let weatherUnInshort = weatherFormatting(weatherUnIn);

  console.log('weatherUnInshort::'+ weatherUnInshort);
  var weatherIn = new Weather(weatherUnInshort);
  try {
    weatherIn = await weatherIn.save();
    console.log('here: ' + weatherIn);
    return weatherIn;
  } catch (e) {
    throw e;
  }
}

exports.getWeatherForecast = async function (req, res) {
  let lat = req.query.lat;
  let lon = req.query.lon;
  let days = req.query.days;

  let url = config.weather.openWeatherForecastUri + '?';
  if (lat && lon) {
    url = url + 'lat='+ lat + '&lon=' + lon;
  } else {
    var err =  new Error();
    err.code = constants.ERROR_CODE_UNSUPPORTED_MEDIA_TYPE;
    throw err;
  }
  if (days > 0) {
    url = url + '&cnt=' + days;
  }
  url = url + '&units=imperial&exclude=minutely,hourly&appid=' + config.weather.apiKey;
  console.log('url::'+ url);
  request(url, function (err, response, body) {
    if (err) {
      console.log('error:', err);
    } else {
      console.log('body:', body);
      let weather = JSON.parse(body)
      return res.json(weather);
    }
  });
};
