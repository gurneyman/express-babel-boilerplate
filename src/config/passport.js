import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import bcrypt from 'bcrypt';
import secret from '../secret';

import UserModel from '../models/user';

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;

passport.use(new LocalStrategy({
    usernameField: username,
    passwordField: password,
}, async (username, password, done) => {
    try {
        const userDocument = await UserModel.findOne({username}).exec();
        const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);

        if (passwordsMatch) {
            return done(null, userDocument);
        } else {
            return done('Incorrect Username / Password');
        }
    } catch (error) {
        done(error);
    }
}));

passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: secret,
},
(jwtPayload, done) => {
    if (jwtPayload.expires > Date.now()) {
        return done('jwt expired');
    }

    return done(null, jwtPayload);
    }
));