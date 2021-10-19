
/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  Schema = mongoose.Schema,
  chalk = require('chalk'),
  validator = require('validator');

/**
 * Weather Schema
 */
var WeatherSchema = new Schema({
  temp: {
    type: Number
  },
  feels_like: {
    type: Number
  },
  temp_min: {
    type: Number
  },
  temp_max: {
    type: Number
  },
  lat: {
    type: Number
  },
  lon: {
    type: Number
  },
  pressure: {
    type: Number
  },
  humidity: {
    type: Number
  },
  dt: {
    type: Number
  },
  sunrise: {
    type: Number
  },
  sunset: {
    type: Number
  },
  visibility: {
    type: Number
  },
  windSpeed: {
    type: Number
  },
  windGust: {
    type: Number
  },
  windDeg: {
    type: Number
  }
});

/**
 * Hook a pre save method to hash the password
 */
WeatherSchema.pre('save', function (next) {
  next();
});

/**
 * Hook a pre validate method to test the local password
 */
WeatherSchema.pre('validate', function (next) {
  next();
});

WeatherSchema.set('toJSON', {
  //  virtuals: true,
  transform: (doc, ret, options) => {
    // delete ret.__v;
    //    delete ret.id;
  }
});

WeatherSchema.set('toObject', {
  virtuals: true
});

/**
 * Sample Instance method
 */
WeatherSchema.methods.sampleMethod = function () {

};

/**
 * Sample Statics method
 */
WeatherSchema.statics.sampleStaticMethod = function (username, suffix, callback) {
  var _this = this;
  callback();
};

module.exports = mongoose.model('Weather', WeatherSchema);
