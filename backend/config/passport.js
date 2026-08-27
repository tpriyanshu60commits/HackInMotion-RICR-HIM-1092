import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // If user exists but no googleId, link them
          if (!user.googleId) {
            user.googleId = profile.id;
            user.emailVerified = true;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          emailVerified: true, // Google emails are verified
          // Missing password is fine because we set required: false
        });

        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err, null);
      }
    }
  )
);
