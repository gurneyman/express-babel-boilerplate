import passport from 'passport';
import jwt from 'jsonwebtoken';
import secret from '../secret';


const LoginController = (req, res) => {
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
};

export default LoginController;