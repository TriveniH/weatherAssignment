'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  chalk = require('chalk'),
  path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose');

// Load the mongoose models
module.exports.loadModels = function (callback) {
  // Globbing model files
  config.files.server.models.forEach(function (modelPath) {
    console.log('here??'+ modelPath);
    require(path.resolve(modelPath));
  });

  if (callback) callback();
};

// Initialize Mongoose
module.exports.connect = function (cb) {
  var _this = this;

  mongoose.Promise = config.db.promise;
  var options = _.merge(config.db.options || {}, {
      useMongoClient: true
    });
  mongoose
      .connect(config.db.uri, options)
      .then(function (connection) {

        // Enabling mongoose debug mode if required
        mongoose.set('debug', config.db.debug);

        // Call callback FN
        if (cb) cb(connection.db);
      })
      .catch(function (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(err);
      });

};

module.exports.disconnect = function (cb) {
  mongoose.disconnect(function (err) {
    console.info(chalk.yellow('Disconnected from MongoDB.'));
    cb(err);
  });
};
