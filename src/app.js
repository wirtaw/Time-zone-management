'use strict';

const path = require('path');

const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const helmet = require('helmet');

const app = express();

const getInfo = require('./utils/index');
const port = 3001;

app.use(helmet());

// Define trusted and localhost script sources
const trustedScripts = ['cdn.jsdelivr.net'];
const localhostScripts = ['localhost', '127.0.0.1'];

// Define trusted and localhost image sources
const trustedImages = ['res.cloudinary.com'];
const localhostImages = ['localhost', '127.0.0.1'];

// Combine trusted and localhost scripts for scriptSrc directive
const scriptSources = trustedScripts.concat(localhostScripts.map(origin => `'self'` + (origin === 'localhost' ? ` ${origin}:${port}` : '')));
const imageSources = trustedImages.concat(localhostImages.map(origin => `'self'` + (origin === 'localhost' ? ` ${origin}:${port}` : '')));

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: scriptSources,
    imgSrc: imageSources,
  }
}));

if (app.get('env') === 'production') {
  app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}

app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, '../templates'));

const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res) {
    res.set('x-timestamp', Date.now());
  }
};

app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public'), options));

app.set('view engine', 'html');
// Express and Passport Session

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'foobar',
    resave: false,
    saveUninitialized: false
  })
);

app.get('/', function(req, res){
  const info = getInfo();
  res.render('main', { info, title: 'DateTime Luxon' });
});

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: JSON.stringify(err.message, undefined, 2),
    status: err.status
  });
});

module.exports = app;
