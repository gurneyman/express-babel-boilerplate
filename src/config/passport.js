import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import bcrypt from 'bcrypt';
import secret from '../secret';

import UserModel from '../models/user';

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;

const localStrategyConfig = {
    usernameField: 'username',
    passwordField: 'password',
    session: false
};

async function localStrategyImpl(username, password, done) {
    try {
        const userDocument = await UserModel.findOne({ username }).exec();
        const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);
        if (passwordsMatch) {
            return done(null, userDocument);
        }
        else {
            return done('Incorrect Username / Password');
        }
    }
    catch (error) {
        done(error);
    }
}

const localStrategy = new LocalStrategy(localStrategyConfig, localStrategyImpl);

// TODO: Make own module
const jwtStrategyConfig = {
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: secret,
    session: false
};

function jwtStrategyImpl(jwtPayload, done) {
    if (jwtPayload.expires < Date.now()) {
        return done('jwt expired');
    }
    return done(null, jwtPayload);
}

const jwtStrategy = new JWTStrategy(jwtStrategyConfig, jwtStrategyImpl);

export default () => {
    passport.use(localStrategy);
    passport.use(jwtStrategy);
}


