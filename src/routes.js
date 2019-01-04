import { Router } from 'express';

const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.render('index', { title: 'Express Babel' });
});

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/list', (req, res, next) => {
  const { title } = req.query;

  if (title == null || title === '') {
    // TODO: Think about using https://github.com/kbariotis/throw.js)
    let err = new Error('The "title" parameter is required');
    err.status = 400;
    next(err);
    return;
  }

  res.render('index', { title });
});

export default routes;
