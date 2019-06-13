/* eslint-disable */
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import TwitterTokenStrategy from 'passport-twitter';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    includeEmail: true,
    callbackURL: '/api/auth/login/google/redirect'
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }
));
passport.use(new FacebookStrategy(
  {
    clientID: process.env.FCBK_ID,
    clientSecret: process.env.FCBK_APP_SECRET,
    callbackURL: '/api/auth/login/facebook/redirect',
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }
));
passport.use(
  new TwitterTokenStrategy(
    {
      consumerKey: process.env.TWITTER_ID,
      consumerSecret: process.env.TWITTER_APP_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/login/twitter/redirect`
    },
    (token, tokenSecret, profile, done) => {
      done(null, profile);
    }
  )
);
