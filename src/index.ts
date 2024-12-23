import env from 'dotenv';
import express, { Request, Response } from "express";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';

env.config();
GoogleStrategy.Strategy;
const app = express();

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    return done(null, profile);
}));

passport.serializeUser((user: any, done) => {
    done(null, user);
});

passport.deserializeUser((user: any, done) => {
    done(null, user);
});

app.get('/', (req: Request, res: Response) => {
    res.send("<a href = '/auth/google'>Login With Google </a>");
  });

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req: Request, res: Response) => {
    res.redirect('/profile');
});

app.get('/profile', (req: Request, res: Response) => {
    res.send(JSON.stringify(req.user) + "<a href = '/logout'>Logout</a>");
});

app.get('/logout', (req: Request, res: Response) => {
    req.logout((error) => {
        if(error){
            return res.status(500).send(error.message);
        }
        res.redirect('/');
    });
});
app.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('http://localhost:3000');
});