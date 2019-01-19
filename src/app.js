import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';

import configureHelmet from './config/helmet';
import configureMongoose from './config/mongoose';
import configurePassport from './config/passport';

import configureRoutes from './routes';

// TODO: Need some linting going on here
// TODO: Create issues for these todos on my github repo
// TODO: Create tasks implementing https://github.com/i0natan/nodebestpractices as appropriate
const app = express();
app.disable('x-powered-by');

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '../public')));

// Configuration
configureHelmet(app);
configureMongoose();
configurePassport();

// Dev config
app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



configureRoutes(app);

// TODO: Create error handling module... inject app.
// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res) => {
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message
    });
});

export default app;
