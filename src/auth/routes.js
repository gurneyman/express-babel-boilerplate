import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import secret from '../secret';

const routes = Router();

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
  
      return res.status(200).send({username});
    } catch (error) {
      return res.status(400).send({
        error: 'req body should be { username, password }'
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
          res.cookie('jwt', token, { httpOnly: true, secure: false });
          res.status(200).send({ username, what: "what" });
        });
      }
    )(req, res);
  });
  
routes.get('/protected',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const { user } = req;
        user.expiresDate = new Date(user.expires).toString();
        res.status(200).send({ user });
    }
);

export default routes;