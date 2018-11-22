import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import routes from './routes';

const app = express();
app.disable('x-powered-by');

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.expectCt({
  enforce: false,
  maxAge: 0
}));
app.use(helmet.featurePolicy({
  features: {
    camera: ["'none'"],
    fullscreen: ["'none'"],
    geolocation: ["'none'"],
    gyroscope: ["'none'"],
    magnetometer: ["'none'"],
    microphone: ["'none'"],
    midi: ["'none'"],
    notifications: ["'none'"],
    payment: ["'none'"],
    push: ["'none'"],
    speaker: ["'none'"],
    syncXhr: ["'none'"],
    vibrate: ["'none'"],
  }
}));

app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message
    });
});

export default app;
