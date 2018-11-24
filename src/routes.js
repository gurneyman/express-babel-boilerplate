import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from './models/user';
import secret from './secret';

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
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    let err = new Error('The "title" parameter is required');
    err.status = 400;
    next(err);
    return;
  }

  res.render('index', { title });
});

// Auth Routes
routes.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // authentication will take approximately 13 seconds
  // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
  const hashCost = 10;

  try {
    const passwordHash = await bcrypt.hash(password, hashCost);
    const userDocument = new UserModel({ username, passwordHash });
    await userDocument.save();

    res.status(200).send({username});
  } catch (error) {
    res.status(400).send({
      error: 'req body should be {username, password }'
    })
  }
});

routes.post('/login', (req, res) => {
  passport.authenticate(
    'local',
    { session: false },
    (error, user) => {
      if (error || !user) {
        res.status(400).json({error});
      }

      const {username} = user;
      // TODO: use env for expires time
      const payload = {
        username,
        expires: Date.now() + parseInt(10000000)
      };

      req.login(payload, {session: false}, (error) => {
        if (error) {
          res.status(400).json({error});
        }

        const token = jwt.sign(JSON.stringify(payload), secret);

        /** assign our jwt to the cookie */
        res.cookie('jwt', token, { httpOnly: true, secure: true });
        res.status(200).send({ username });
      });
    }
  )(req, res);
});

export default routes;
