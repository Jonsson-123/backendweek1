'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const {getUserLogin} = require('../models/userModel');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcryptjs');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// local strategy for username password login
passport.use(new Strategy(
    async (username, password, done) => {
        const params = [username];
        try {
            const [user] = await getUserLogin(params);
            console.log('Local strategy', user); // result is binary row
            if (user === undefined) {
                return done(null, false, {message: 'Incorrect email.'});
            }
            // TODO: use bcrypt to check of passwords don't match
            // Hashaa käyttäjän antaman salasanan ja vertaa sitä tietokannan hashattuun salasanaan
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, {message: 'Incorrect password.'});
            }
            delete user.password;
            return done(null, {...user}, {message: 'Logged In Successfully'}); // use spread syntax to create shallow copy to get rid of binary row type
        } catch (err) {
            return done(err);
        }
    }));

// TODO: JWT strategy for handling bearer token
passport.use(new JWTStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'dihfgadoisdwdf2',
    }, (jwtPayload, done) => {
        console.log('JWTStrategy', jwtPayload);
        done(null, jwtPayload);
    }));

// consider .env for secret, e.g. secretOrKey: process.env.JWT_SECRET

module.exports = passport;