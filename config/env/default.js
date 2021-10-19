'use strict';

module.exports = {
  app: {
    title: 'weather-dev',
    description: 'a sample weather app',
    keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
  },
  weather: {
    openWeatherUri: process.env.OPEN_WEATHER_URI || 'http://api.openweathermap.org/data/2.5/weather',
    openWeatherForecastUri: process.env.OPEN_WEATHER_FORECAST_URI || 'https://api.openweathermap.org/data/2.5/onecall',
    defaultForecastDays: 7,
    apiKey: '3568bd1e08bbd0c6f83ef2ac2be84bd1'
  },
  db: {
    promise: global.Promise,
    debug: process.env.MONGODB_DEBUG || false,
    uri: process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/' + (process.env.DB_1_NAME || 'weather_dev'),
    options: {}
  },
  port: 3000,
  host: '0.0.0.0',
  // DOMAIN config should be set to the fully qualified application accessible
  // URL. For example: https://www.myapp.com (including port if required).
  domain: process.env.DOMAIN,
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  // sessionKey is the cookie session name
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  illegalUsernames: ['meanjs', 'administrator', 'password', 'admin', 'user',
    'unknown', 'anonymous', 'null', 'undefined', 'api'
  ],
  uploads: {
    profile: {
      image: {
        limits: {
          fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      }
    }
  },
  shared: {
    owasp: {
      allowPassphrases: true,
      maxLength: 128,
      minLength: 10,
      minPhraseLength: 20,
      minOptionalTestsToPass: 4
    }
  }
};